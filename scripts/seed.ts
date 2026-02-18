import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

// ---- Data ----
const projects = [
  {
    title: 'QuickPost',
    description: 'A modern social media micro platform to share images and videos instantly.',
    technologies: ['Python', 'ImageKit', 'PostgreSQL', 'FastAPI'],
    githubLink: 'https://github.com/ItzYuva/QuickPost',
    demoLink: 'https://demo.com',
    image: '/projects/quick_post.jpeg',
  },
  {
    title: 'Audio Visualizer',
    description: 'An end to end audio classification system that converts raw audio into Mel spectrograms and trains a deep Residual CNN to classify environmental sounds.',
    technologies: ['PyTorch', 'TorchAudio', 'Librosa', 'FastAPI', 'NumPy', 'Pandas', 'Modal'],
    githubLink: 'https://github.com/ItzYuva/Audio-CNN',
    demoLink: 'https://demo.com',
    image: '/projects/audio_visualizer.jpeg',
  },
  {
    title: 'Retrivo',
    description: 'RAG application that allows users to upload PDFs, ingest their content into a vector database, and ask questions about them.',
    technologies: ['Qdrant', 'Python', 'Inngest'],
    githubLink: 'https://github.com/ItzYuva/Retrivo',
    demoLink: 'https://demo.com',
    image: '/projects/retrivo.jpeg',
  },
  {
    title: 'Virtual Whiteboard',
    description: 'A collaborative virtual whiteboard application with real time drawing capabilities.',
    technologies: ['OpenCV', 'Numpy', 'Python'],
    githubLink: 'https://github.com/ItzYuva/virtual-whiteboard',
    demoLink: 'https://demo.com',
    image: '/projects/virtualBoard.jpeg',
  },
  {
    title: 'Ping Pong Game',
    description: 'A classic ping pong game which can be played using hand gestures.',
    technologies: ['Python', 'OpenCV'],
    githubLink: 'https://github.com/ItzYuva/ping-pong-game',
    demoLink: 'https://demo.com',
    image: '/projects/ping_pong.jpeg',
  },
]

const blogs = [
  {
    title: 'How Corrective RAG can make your RAG system less dumb?',
    excerpt: 'Your AI retrieves first and thinks never. CRAG flips that around — think first, then talk.',
    date: '2025-02-17',
    readTime: '2 min read',
    slug: 'corrective-rag',
    mediumUrl: 'https://medium.com/@yuvi110403/how-corrective-rag-can-make-your-rag-system-less-dumb-4adb03cda834',
  },
]

const about = {
  bio: 'AI Engineer Building Intelligent Systems. Passionate about machine learning, software engineering, and building products that make a difference.',
  skills: [
    { name: 'Python', level: 'Expert' },
    { name: 'PyTorch', level: 'Advanced' },
    { name: 'FastAPI', level: 'Advanced' },
    { name: 'Next.js', level: 'Intermediate' },
    { name: 'TypeScript', level: 'Intermediate' },
    { name: 'PostgreSQL', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Intermediate' },
    { name: 'Docker', level: 'Intermediate' },
  ],
  experience: [
    {
      title: 'Operations Intern',
      company: 'INVIDI Technologies Corporation India Pvt Ltd',
      period: 'Feb 2025 - Sep 2025',
      description: [
        'Developed an intelligent RAG based query system using PyTorch and LLMs.',
        'Gained hands on experience with DVB systems and real time media streaming tools.',
        'Processed 1200+ pages for semantic search using text embeddings.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science (Specialization in AI & ML)',
      institution: 'Manipal University Jaipur',
      period: '2021 - 2025',
      description: 'Graduated with honors. Focused on machine learning and software engineering.',
    },
    {
      degree: 'Senior Secondary (XII) - CBSE',
      institution: 'St. Paul Sr. Secondary',
      period: '2020 - 2021',
      description: 'Physics, Chemistry, Mathematics & Physical Education.',
    },
    {
      degree: 'Secondary (X) - CBSE',
      institution: 'DAV Public School',
      period: '2018 - 2019',
      description: 'Physics, Chemistry & Mathematics.',
    },
  ],
}

const contact = {
  email: 'adityauv11@gmail.com',
  phone: '+91 8955341508',
  location: 'India',
  githubUrl: 'https://github.com/ItzYuva',
  linkedinUrl: 'https://www.linkedin.com/in/adityakumarsinha110403/',
}

// ---- Schemas ----
const ProjectSchema = new mongoose.Schema({ title: String, description: String, technologies: [String], githubLink: String, demoLink: String, image: String }, { timestamps: true })
const BlogSchema = new mongoose.Schema({ title: String, excerpt: String, date: String, readTime: String, slug: String, mediumUrl: String }, { timestamps: true })
const AboutSchema = new mongoose.Schema({ bio: String, skills: Array, experience: Array, education: Array }, { timestamps: true })
const ContactSchema = new mongoose.Schema({ email: String, phone: String, location: String, githubUrl: String, linkedinUrl: String }, { timestamps: true })

const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
const AboutModel = mongoose.models.About || mongoose.model('About', AboutSchema)
const ContactModel = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)

// ---- Seed ----
async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  await ProjectModel.deleteMany({})
  await BlogModel.deleteMany({})
  await AboutModel.deleteMany({})
  await ContactModel.deleteMany({})
  console.log('🗑️  Cleared existing data')

  await ProjectModel.insertMany(projects)
  console.log(`✅ Seeded ${projects.length} projects`)

  await BlogModel.insertMany(blogs)
  console.log(`✅ Seeded ${blogs.length} blogs`)

  await AboutModel.create(about)
  console.log('✅ Seeded about info')

  await ContactModel.create(contact)
  console.log('✅ Seeded contact info')

  await mongoose.disconnect()
  console.log('🎉 Seeding complete!')
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
