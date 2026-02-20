'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
  staggerContainer,
  cardHover,
  cardHoverSmall
} from '@/utils/animations'

interface Skill { name: string; level: string }
interface Experience { title: string; company: string; period: string; description: string[] }
interface Education { degree: string; institution: string; period: string; description: string }

interface AboutData {
  _id: string
  bio: string
  skills: Skill[]
  experience: Experience[]
  education: Education[]
}

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => { setAbout(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="container max-w-7xl mx-auto py-12 text-center text-secondary">
      Loading...
    </div>
  )

  if (!about) return (
    <div className="container max-w-7xl mx-auto py-12 text-center text-secondary">
      About information not available.
    </div>
  )

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        {...fadeInDown}
      >
        About Me
      </motion.h1>

      {/* Bio Section */}
      <motion.section
        className="mb-16"
        {...fadeInUp}
      >
        <p className="text-lg text-secondary max-w-3xl mx-auto text-center">
          {about.bio}
        </p>
      </motion.section>

      {/* Skills Section */}
      {about.skills.length > 0 && (
        <motion.section
          className="mb-16"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            className="section-title"
            {...fadeInUp}
          >
            Skills
          </motion.h2>
          <motion.div
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {about.skills.map((skill, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
                variants={fadeInUp}
                {...cardHover}
              >
                <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                <p className="text-secondary">{skill.level}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Experience Section */}
      {about.experience.length > 0 && (
        <motion.section
          className="mb-16"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.h2
            className="section-title"
            {...fadeInUp}
          >
            Experience
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {about.experience.map((exp, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
                variants={fadeInUp}
                {...cardHoverSmall}
              >
                <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                <p className="text-primary mb-2">{exp.company} &bull; {exp.period}</p>
                {exp.description.length > 0 && (
                  <ul className="text-secondary list-disc list-inside space-y-2">
                    {exp.description.map((desc, j) => (
                      <li key={j}>{desc}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Education Section */}
      {about.education.length > 0 && (
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          <motion.h2
            className="section-title"
            {...fadeInUp}
          >
            Education
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {about.education.map((edu, i) => (
              <motion.div
                key={i}
                className={`bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md${i > 0 ? ' mt-8' : ''}`}
                variants={fadeInUp}
                {...cardHoverSmall}
              >
                <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                <p className="text-primary mb-2">{edu.institution} &bull; {edu.period}</p>
                <p className="text-secondary">{edu.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}
    </div>
  )
}
