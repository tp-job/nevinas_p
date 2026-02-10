import type { FC } from "react";

const ToolCard: FC = ({ title, desc, link }) => {
    return (
        <div className="card">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">{desc}</p>
            </div>
            <a href={link} className="text-velvet-violet text-sm font-bold hover:underline" target="_blank" rel="noreferrer" >Learn more →</a>
        </div>
    );
};

export default ToolCard;