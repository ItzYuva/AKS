import { Project } from "@/types";

export const projects: Project[] = [
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
      }
  ];