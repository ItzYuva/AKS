'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'

interface Skill { name: string; level: string }
interface Experience { title: string; company: string; period: string; description: string[] }
interface Education { degree: string; institution: string; period: string; description: string }

export default function AdminAbout() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState<Skill[]>([{ name: '', level: '' }])
  const [experience, setExperience] = useState<Experience[]>([{ title: '', company: '', period: '', description: [''] }])
  const [education, setEducation] = useState<Education[]>([{ degree: '', institution: '', period: '', description: '' }])

  useEffect(() => {
    fetch('/api/about')
      .then(r => r.json())
      .then(data => {
        if (data?._id) {
          setBio(data.bio || '')
          if (data.skills?.length) setSkills(data.skills)
          if (data.experience?.length) setExperience(data.experience)
          if (data.education?.length) setEducation(data.education)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, skills, experience, education }),
    })
    setSaving(false)
    if (res.ok) setSuccess(true)
  }

  // Skills helpers
  const addSkill = () => setSkills([...skills, { name: '', level: '' }])
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i))
  const updateSkill = (i: number, field: keyof Skill, value: string) => {
    const updated = [...skills]
    updated[i] = { ...updated[i], [field]: value }
    setSkills(updated)
  }

  // Experience helpers
  const addExperience = () => setExperience([...experience, { title: '', company: '', period: '', description: [''] }])
  const removeExperience = (i: number) => setExperience(experience.filter((_, idx) => idx !== i))
  const updateExperience = (i: number, field: keyof Omit<Experience, 'description'>, value: string) => {
    const updated = [...experience]
    updated[i] = { ...updated[i], [field]: value }
    setExperience(updated)
  }
  const addExpDesc = (i: number) => {
    const updated = [...experience]
    updated[i] = { ...updated[i], description: [...updated[i].description, ''] }
    setExperience(updated)
  }
  const updateExpDesc = (i: number, j: number, value: string) => {
    const updated = [...experience]
    const desc = [...updated[i].description]
    desc[j] = value
    updated[i] = { ...updated[i], description: desc }
    setExperience(updated)
  }
  const removeExpDesc = (i: number, j: number) => {
    const updated = [...experience]
    updated[i] = { ...updated[i], description: updated[i].description.filter((_, idx) => idx !== j) }
    setExperience(updated)
  }

  // Education helpers
  const addEducation = () => setEducation([...education, { degree: '', institution: '', period: '', description: '' }])
  const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i))
  const updateEducation = (i: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[i] = { ...updated[i], [field]: value }
    setEducation(updated)
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">About</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
        {/* Bio */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Bio</h2>
          <textarea value={bio} onChange={e => setBio(e.target.value)} required rows={4} className={inputClass} />
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <button type="button" onClick={addSkill} className="flex items-center gap-1 text-sm text-primary hover:underline">
              <FaPlus className="h-3 w-3" /> Add Skill
            </button>
          </div>
          <div className="space-y-3">
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input placeholder="Skill name" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} required className={inputClass} />
                <input placeholder="Level (e.g. Advanced)" value={skill.level} onChange={e => updateSkill(i, 'level', e.target.value)} required className={inputClass} />
                {skills.length > 1 && (
                  <button type="button" onClick={() => removeSkill(i)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            <button type="button" onClick={addExperience} className="flex items-center gap-1 text-sm text-primary hover:underline">
              <FaPlus className="h-3 w-3" /> Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Experience #{i + 1}</span>
                  {experience.length > 1 && (
                    <button type="button" onClick={() => removeExperience(i)} className="text-red-500 hover:underline text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Period</label>
                  <input value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} required placeholder="e.g. Jan 2024 - Present" className={inputClass} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Description Points</label>
                    <button type="button" onClick={() => addExpDesc(i)} className="text-xs text-primary hover:underline">+ Add Point</button>
                  </div>
                  {exp.description.map((desc, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <input value={desc} onChange={e => updateExpDesc(i, j, e.target.value)} className={inputClass} placeholder="Description point..." />
                      {exp.description.length > 1 && (
                        <button type="button" onClick={() => removeExpDesc(i, j)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <FaTrash className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <button type="button" onClick={addEducation} className="flex items-center gap-1 text-sm text-primary hover:underline">
              <FaPlus className="h-3 w-3" /> Add Education
            </button>
          </div>
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Education #{i + 1}</span>
                  {education.length > 1 && (
                    <button type="button" onClick={() => removeEducation(i)} className="text-red-500 hover:underline text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution</label>
                    <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Period</label>
                  <input value={edu.period} onChange={e => updateEducation(i, 'period', e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input value={edu.description} onChange={e => updateEducation(i, 'description', e.target.value)} required className={inputClass} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : 'Save About'}
          </button>
          {success && <span className="text-green-500 font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  )
}
