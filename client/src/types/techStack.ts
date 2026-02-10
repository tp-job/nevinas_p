export interface TechStack {
    id: string;
    name: string;
    description: string;
    category: string;
    itemTools: string[];
    icon: string;
    color: string;
    link: string;
}

export interface TechStackCardProps {
    techStack: TechStack;
}