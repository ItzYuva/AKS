'use client'

import { FaCode, FaLaptopCode, FaGraduationCap } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { 
  fadeInUp, 
  fadeInDown, 
  fadeIn, 
  staggerContainer, 
  cardHover, 
  cardHoverSmall 
} from '@/utils/animations'

export default function About() {
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
          I&apos;m a AI/ML Engineer passionate about building intelligent systems that solve real world problems.
          I enjoy experimenting with models, improving their performance, and bridging the gap between theory and practical implementation.
        </p>
      </motion.section>

      {/* Skills Section */}
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
          <motion.div 
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHover}
          >
            <FaCode className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Machine Learning & AI</h3>
            <ul className="text-secondary space-y-2">
              <li>Deep Learning (CNNs, Neural Networks)</li>
              <li>Model Evaluation & Optimization</li>
              <li>Feature Engineering</li>
              <li>PyTorch</li>
              <li>Scikit-learn</li>
              <li>OpenCV</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHover}
          >
            <FaLaptopCode className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Programming & Development</h3>
            <ul className="text-secondary space-y-2">
              <li>Python</li>
              <li>Java</li>
              <li>MySQL</li>
              <li>Rest API</li>
              <li>Web Fundamentals</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHover}
          >
            <FaGraduationCap className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tools & Workflows</h3>
            <ul className="text-secondary space-y-2">
              <li>Git / GitHub</li>
              <li>Debugging & Testing</li>
              <li>AWS</li>
              <li>VS Code</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Experience Section */}
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
          <motion.div 
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">Associate System Engineer</h3>
            <p className="text-primary mb-2">Tata Consultancy Services Limited • Dec 2025 - Present</p>
            <ul className="text-secondary list-disc list-inside space-y-2">
              <li>Led development of multiple web applications using React and Node.js.</li>
              <li>Implemented CI/CD pipelines reducing deployment time by 50%.</li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">Operations Intern</h3>
            <p className="text-primary mb-2">INVIDI Technologies Corporation India Pvt Ltd • Feb 2025 - Sep 2025</p>
            <ul className="text-secondary list-disc list-inside space-y-2">
              <li>Developed an intelligent RAG based query system using PyTorch and LLMs.</li>
              <li>Gained hands on experience with DVB systems and real time media streaming tools.</li>
              <li>Processed 1200+ pages for semantic search using text embeddings.</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Education Section */}
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
          <motion.div
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">B.Tech in Computer Science (Specialization in AI & ML)</h3>
            <p className="text-primary mb-2">Manipal University Jaipur • 2021 - 2025</p>
            <p className="text-secondary">
              Graduated with honors. Focused on machine learning and software engineering.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md mt-8"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">Senior Secondary (XII) - CBSE</h3>
            <p className="text-primary mb-2">St. Paul Sr. Secondary • 2020 - 2021</p>
            <p className="text-secondary">
              Physics, Chemistry, Mathematics & Physical Education.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md mt-8"
            variants={fadeInUp}
            {...cardHoverSmall}
          >
            <h3 className="text-xl font-semibold mb-2">Secondary (X) - CBSE</h3>
            <p className="text-primary mb-2">DAV Public School • 2018 - 2019</p>
            <p className="text-secondary">
              Physics, Chemistry & Mathematics.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
} 