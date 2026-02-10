export interface Tool {
    id: string;
    name: string;
    description: string;
    category: string;
    itemTools: string[];
    icon: string;
    color: string;
    link: string;
}

export interface ToolCardProps {
    tool: Tool;
}

export interface ToolSection {
    id: string;
    title: string;
    tools: {
        title: string;
        desc: string;
        link: string;
    }[];
}