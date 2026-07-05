import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changelog } from '../../config/changelog';
import LegalModal from '../../components/LegalModal';

export default function Footer() {
    const navigate = useNavigate();
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [legalContent, setLegalContent] = useState<{ title: string; text: string } | null>(null);

    return (
        <>
            <footer className="border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#6366F1] rounded-lg flex items-center justify-center font-black text-[9px] text-white">
                            IQ
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">PrepIQ</span>
                    </div>
                    <div className="flex gap-6 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        <button
                            type="button"
                            onClick={() => setLegalContent({
                                title: "Privacy Policy",
                                text: "Your privacy is fully protected under our serverless data pipeline architecture. PrepIQ does not manage local user credential databases; authentication relies exclusively on secure Google OAuth tokens. Application data—including analyzed job descriptions, confidence logs, and flashcard metrics—is securely mapped to your isolated user identity record via Firebase Security Rules."
                            })}
                            className="hover:text-slate-900 dark:hover:text-slate-300 transition"
                        >
                            Privacy Policy
                        </button>
                        <button
                            type="button"
                            onClick={() => setLegalContent({
                                title: "Terms of Service",
                                text: "Welcome to PrepIQ. By authenticating with Google Sign-In and utilizing this platform, you agree that your data is processed entirely serverless via isolated Cloud Firestore instances. PrepIQ is a developmental technical interview preparation framework built for educational and benchmarking use. All generative insights are produced via the Gemini API as structural schema models."
                            })}
                            className="hover:text-slate-900 dark:hover:text-slate-300 transition"
                        >
                            Terms of Service
                        </button>
                        <button
                            onClick={() => setIsChangelogOpen(true)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                            Changelog
                        </button>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-300 dark:text-slate-600 uppercase tracking-widest text-center">
                        © {new Date().getFullYear()} PrepIQ · All rights reserved
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/aakash-kapoor/prepiq-react" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition">
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>

            {/* Changelog Modal */}
            {isChangelogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] max-h-[80dvh] animate-scaleUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">System Changelog</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">System releases, patches, and deployment milestones.</p>
                            </div>
                            <button
                                onClick={() => setIsChangelogOpen(false)}
                                className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                            {changelog.slice(0, 3).map((log, index) => (
                                <div key={log.version} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 last:border-transparent space-y-2">
                                    <div className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ring-4 ring-[#F8FAFC] dark:ring-slate-900 ${index === 0 ? 'bg-indigo-500' : index < 3 ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{log.version}</span>
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">{log.date}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{log.title}</h3>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{log.description}</p>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {log.tags.map((tag) => (
                                            <span key={tag} className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                Showing the latest 3 releases.
                            </span>
                            <button
                                onClick={() => {
                                    setIsChangelogOpen(false);
                                    navigate('/changelog');
                                }}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1"
                            >
                                View Full Release History ({changelog.length} versions) →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Modal */}
            {legalContent && (
                <LegalModal
                    content={legalContent}
                    onClose={() => setLegalContent(null)}
                />
            )}
        </>
    );
}
