import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiDocker,
  SiSpringboot,
  SiOpenai,
  SiHuggingface,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

export interface TechItem {
  name: string;
  icon: IconType;
  color: string;
  darkColor?: string;
}

export const techStack: TechItem[] = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'Java', icon: FaJava, color: '#ED8B00' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000', darkColor: '#ffffff' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Express', icon: SiExpress, color: '#000000', darkColor: '#ffffff' },
  { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'GitHub', icon: SiGithub, color: '#181717', darkColor: '#ffffff' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
  { name: 'OpenAI', icon: SiOpenai, color: '#412991', darkColor: '#a78bfa' },
  { name: 'Hugging Face', icon: SiHuggingface, color: '#FFD21E' },
];

export function findTechIcon(name: string): TechItem | undefined {
  return techStack.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
}
