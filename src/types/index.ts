export interface Project {
    title: string;
    description: string;
    technologies: string[];
    githubLink: string;
    demoLink: string;
    image: string;
}

export interface Blog {
    _id?: string;
    title: string;
    excerpt: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}