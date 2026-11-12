'use client'

interface Skill { name: string; level: string }
interface Experience { title: string; company: string; period: string; description: string[] }
interface Education { degree: string; institution: string; period: string; description: string }

export interface AboutData {
  _id: string
  bio: string
  skills: Skill[]
  experience: Experience[]
  education: Education[]
}

export default function AboutContent({ about }: { about: AboutData | null }) {
  if (!about) return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center text-zinc-500 dark:text-zinc-400">
      About information not available.
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-6">
        About Me
      </h1>

      {/* Bio */}
      <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-[1.8] mb-14 max-w-xl">
        {about.bio}
      </p>

      {/* Skills */}
      {about.skills.length > 0 && (
        <section className="mb-14">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-5">
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {about.skills.map((skill, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-4"
              >
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 mb-1">{skill.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{skill.level}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {about.experience.length > 0 && (
        <section className="mb-14">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-5">
            Experience
          </h2>
          <div className="space-y-6">
            {about.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-200">
                    {exp.title}
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> &middot; {exp.company}</span>
                  </h3>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                {exp.description.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="flex items-start gap-2 text-[15px] text-zinc-600 dark:text-zinc-400">
                        <span className="mt-2 w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {about.education.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-5">
            Education
          </h2>
          <div className="space-y-4">
            {about.education.map((edu, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-200">
                    {edu.degree}
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> &middot; {edu.institution}</span>
                  </h3>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                    {edu.period}
                  </span>
                </div>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
