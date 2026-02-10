import { useState, type FC } from 'react';
import {
    apiEndpoints,
    dataModels,
    architecture,
    folderStructure,
    gettingStarted,
    designSystem,
    changelog,
} from '@/data/docData';

// Theme accent
const TH = {
    azure: '#5983FC',
    orchid: '#964EC2',
    green: '#0f9d58',
    yellow: '#f4b400',
    flamingo: '#FF7BBF',
    royal: '#3E60C1',
};

/* ==================== Method Badge ==================== */
const MethodBadge: FC<{ method: string }> = ({ method }) => {
    const cls: Record<string, string> = {
        GET: 'bg-global-green/10 text-global-green',
        POST: 'bg-global-yellow/10 text-global-yellow',
        PUT: 'bg-matte-azure/10 text-matte-azure',
        DELETE: 'bg-global-red/10 text-global-red',
    };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls[method] || 'bg-light-surface-2 text-light-text-secondary'}`}>{method}</span>;
};

/* ==================== Color Swatch ==================== */
const ColorSwatch: FC<{ name: string; hex: string; variable: string }> = ({ name, hex, variable }) => (
    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50 transition-colors">
        <div className="w-8 h-8 rounded-lg shrink-0 ring-1 ring-light-border dark:ring-dark-border" style={{ backgroundColor: hex }} />
        <div className="min-w-0">
            <p className="text-xs font-semibold text-light-text dark:text-dark-text truncate">{name}</p>
            <p className="text-[10px] font-mono text-light-text-secondary dark:text-dark-text-secondary">{hex}</p>
        </div>
    </div>
);

/* ==================== Docs Page ==================== */
const Docs: FC = () => {
    const [openModel, setOpenModel] = useState<string | null>('Project');
    const cardCls = 'bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden';

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Docs</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">ドキュメント</h3>
            </div>

            {/* ========== Architecture ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Architecture Overview</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Technology stack breakdown</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { title: 'Frontend', icon: 'ri-window-line', color: TH.azure, data: architecture.frontend },
                        { title: 'Backend', icon: 'ri-server-line', color: TH.orchid, data: architecture.backend },
                        { title: 'Dev Tools', icon: 'ri-tools-line', color: TH.yellow, data: architecture.devTools },
                    ].map((section) => (
                        <div key={section.title} className="p-5 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}15` }}>
                                    <i className={`${section.icon} text-lg`} style={{ color: section.color }}></i>
                                </div>
                                <h4 className="text-sm font-bold text-light-text dark:text-dark-text">{section.title}</h4>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(section.data).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: section.color }} />
                                        <div>
                                            <span className="text-[11px] font-medium text-light-text-secondary dark:text-dark-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <p className="text-xs font-semibold text-light-text dark:text-dark-text">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== API Documentation ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">API Endpoints</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">REST API documentation</p>
                <div className="space-y-2">
                    {apiEndpoints.map((api) => (
                        <div key={api.path} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3.5 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-matte-azure/30 transition-colors">
                            <div className="flex items-center gap-3 shrink-0">
                                <MethodBadge method={api.method} />
                                <code className="text-sm font-mono font-semibold text-light-text dark:text-dark-text">{api.path}</code>
                            </div>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary flex-1">{api.description}</p>
                            <code className="text-[10px] font-mono px-2 py-1 rounded-md bg-light-border/30 dark:bg-dark-border/30 text-light-text-secondary dark:text-dark-text-secondary shrink-0 hidden lg:block">{api.response}</code>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== Data Models ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.orchid}60, ${TH.flamingo}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Data Models</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">MongoDB collection schemas</p>

                {/* Model tabs */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {dataModels.map((m) => (
                        <button
                            key={m.name}
                            onClick={() => setOpenModel(openModel === m.name ? null : m.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${openModel === m.name
                                ? 'bg-matte-azure text-white shadow-lg'
                                : 'bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:text-matte-azure'
                                }`}
                        >
                            {m.name}
                            <span className="ml-2 text-[10px] opacity-70">({m.fields.length})</span>
                        </button>
                    ))}
                </div>

                {/* Model fields */}
                {dataModels.filter(m => m.name === openModel).map((model) => (
                    <div key={model.name} className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-light-border dark:border-dark-border">
                                    {['Field', 'Type', 'Required', 'Description'].map(h => (
                                        <th key={h} className="text-left py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {model.fields.map((f) => (
                                    <tr key={f.name} className="border-b border-light-border/30 dark:border-dark-border/30 hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50">
                                        <td className="py-2.5 px-4 font-mono font-semibold text-matte-azure text-xs">{f.name}</td>
                                        <td className="py-2.5 px-4 font-mono text-xs text-velvet-orchid">{f.type}</td>
                                        <td className="py-2.5 px-4">
                                            {f.required
                                                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-global-red/10 text-global-red">required</span>
                                                : <span className="text-[10px] font-medium text-light-text-secondary dark:text-dark-text-secondary">optional</span>
                                            }
                                        </td>
                                        <td className="py-2.5 px-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">{f.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* ========== Getting Started ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Getting Started</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Setup guide for local development</p>
                <div className="space-y-5">
                    {gettingStarted.map((s) => (
                        <div key={s.step} className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-matte-azure/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-matte-azure">{s.step}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-light-text dark:text-dark-text mb-1">{s.title}</h4>
                                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">{s.description}</p>
                                <pre className="text-[11px] font-mono leading-relaxed p-3 rounded-lg overflow-x-auto bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">{s.command}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== Folder Structure ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.royal}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Folder Structure</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-5">Project directory layout</p>
                <pre className="text-[11px] font-mono leading-relaxed p-5 rounded-xl overflow-x-auto bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">{folderStructure}</pre>
            </div>

            {/* ========== Design System ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.flamingo}60, ${TH.orchid}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Design System</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Theme colors and typography</p>

                {/* Main Theme */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">Main Theme (Matte + Velvet)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {designSystem.mainTheme.map(c => <ColorSwatch key={c.hex} {...c} />)}
                </div>

                {/* Light + Dark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">Light Mode</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {designSystem.lightMode.map(c => <ColorSwatch key={c.hex} {...c} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">Dark Mode</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {designSystem.darkMode.map(c => <ColorSwatch key={c.hex} {...c} />)}
                        </div>
                    </div>
                </div>

                {/* Fonts */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-3">Typography</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {designSystem.fonts.map(f => (
                        <div key={f.name} className="p-4 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border">
                            <p className={`text-lg font-semibold text-light-text dark:text-dark-text mb-1 ${f.variable === '--font-zen' ? 'font-zen' : 'font-inter'}`}>{f.name}</p>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{f.usage}</p>
                            <code className="text-[10px] font-mono mt-1 text-matte-azure">{f.variable}</code>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== Changelog ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Changelog</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Version history</p>
                <div className="space-y-6">
                    {changelog.map((entry, i) => (
                        <div key={entry.version} className="relative pl-8">
                            {/* Timeline */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-light-border dark:bg-dark-border" />
                            <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full border-2 border-light-surface dark:border-dark-bg"
                                style={{ backgroundColor: i === 0 ? TH.azure : (i === 1 ? TH.orchid : '#9ca3af') }} />

                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-bold text-light-text dark:text-dark-text">v{entry.version}</span>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">{entry.date}</span>
                                {i === 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-matte-azure/10 text-matte-azure">Latest</span>}
                            </div>
                            <ul className="space-y-1">
                                {entry.changes.map((change, ci) => (
                                    <li key={ci} className="flex items-start gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                        <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-light-text-secondary dark:bg-dark-text-secondary" />
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Docs;
