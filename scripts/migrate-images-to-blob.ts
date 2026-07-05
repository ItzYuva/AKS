/**
 * One-time migration: move images stored as base64 in MongoDB (served via
 * /api/uploads/{id}) onto Vercel Blob, and rewrite the referencing documents
 * to point at the new CDN URLs.
 *
 * Run once, after BLOB_READ_WRITE_TOKEN and MONGODB_URI are set in .env.local:
 *   npx tsx scripts/migrate-images-to-blob.ts
 *
 * Safe to re-run: documents already pointing at Blob URLs are skipped.
 */
import mongoose from 'mongoose'
import { put } from '@vercel/blob'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('MONGODB_URI is not set')
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not set')

const UPLOAD_PREFIX = '/api/uploads/'

// Minimal, self-contained schemas so this script doesn't depend on app aliases.
const UploadModel =
  mongoose.models.Upload ||
  mongoose.model('Upload', new mongoose.Schema({ data: String, contentType: String, filename: String }, { timestamps: true }))
const ProjectModel =
  mongoose.models.Project ||
  mongoose.model('Project', new mongoose.Schema({ image: String }, { strict: false, timestamps: true }))
const BlogModel =
  mongoose.models.Blog ||
  mongoose.model('Blog', new mongoose.Schema({ coverImage: String }, { strict: false, timestamps: true }))

function extractUploadId(url: string): string | null {
  if (!url || !url.includes(UPLOAD_PREFIX)) return null
  const id = url.split(UPLOAD_PREFIX)[1]?.split(/[/?#]/)[0]
  return id || null
}

async function uploadToBlob(id: string): Promise<string | null> {
  const upload = await UploadModel.findById(id).lean<{ data: string; contentType: string; filename: string }>()
  if (!upload) {
    console.warn(`  ⚠️  Upload ${id} not found in DB — leaving URL as-is`)
    return null
  }
  const buffer = Buffer.from(upload.data, 'base64')
  const ext = (upload.contentType.split('/')[1] || 'png').replace('jpeg', 'jpg')
  const name = upload.filename || `${id}.${ext}`
  const blob = await put(name, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: upload.contentType,
  })
  return blob.url
}

async function migrateCollection(
  label: string,
  model: mongoose.Model<any>,
  field: 'image' | 'coverImage'
) {
  const docs = await model.find({ [field]: { $regex: UPLOAD_PREFIX } })
  console.log(`\n${label}: ${docs.length} document(s) with a base64 image to migrate`)
  for (const doc of docs) {
    const url: string = doc[field]
    const id = extractUploadId(url)
    if (!id) continue
    const blobUrl = await uploadToBlob(id)
    if (!blobUrl) continue
    doc[field] = blobUrl
    await doc.save()
    console.log(`  ✅ ${doc.title || doc._id}: ${blobUrl}`)
  }
}

async function main() {
  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB')

  await migrateCollection('Projects', ProjectModel, 'image')
  await migrateCollection('Blogs', BlogModel, 'coverImage')

  await mongoose.disconnect()
  console.log('\n🎉 Migration complete. Old /api/uploads records are left untouched in case you need them.')
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
