import { type RefObject } from 'react';
import Spinner from '../../components/Spinner';

interface ResultsPanelProps {
    analysisResult: any;
    isSaving: boolean;
    panelRef: RefObject<HTMLDivElement | null>;
    onSave: () => void;
}

function getDifficultyClasses(difficulty: string): string {
    const normalized = difficulty?.toLowerCase() || '';
    if (normalized.includes('senior')) return 'bg-red-50 text-red-700 border-red-200';
    if (normalized.includes('junior')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    // Mid-Level and any unrecognized value fall back to amber
    return 'bg-amber-50 text-amber-700 border-amber-200';
}

export default function ResultsPanel({ analysisResult, isSaving, panelRef, onSave }: ResultsPanelProps) {
    return (
        <div
            ref={panelRef}
            className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between min-h-[200px] lg:min-h-[500px] scroll-mt-20 md:scroll-mt-5"
        >
            {!analysisResult ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 my-auto">
                    <span className="text-4xl mb-2">🤖</span>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Awaiting Source Upload Payload</p>
                    <p className="text-xs max-w-xs mt-1 text-slate-400">Your live system tags and structural data blueprint metrics generate right here.</p>
                </div>
            ) : (
                <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-5">
                        <div className="border-b border-gray-100 pb-3 flex flex-wrap justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    🟢 Analysis Complete ✓
                                </span>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5 break-words">{analysisResult.roleTitle || 'Ionic Angular Developer'}</h3>
                                <p className="text-[11px] text-slate-400 font-semibold tracking-wide break-words">Targeting: {analysisResult.companyType || 'Generic Tech Company/Agency'}</p>
                            </div>
                            <span className={`text-[11px] font-bold border px-2.5 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${getDifficultyClasses(analysisResult.estimatedDifficulty || 'Mid-Level')}`}>
                                {analysisResult.estimatedDifficulty || 'Mid-Level'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {analysisResult.extractedSkills?.some((s: any) => s.category === 'Core') && (
                                <div className="space-y-1.5">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Core Skills Required</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysisResult.extractedSkills.filter((item: any) => item.category === 'Core').map((item: any, i: number) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium border bg-indigo-50 text-indigo-700 border-indigo-100">
                                                • {item.skill} <span className="opacity-40 text-[11px]">({item.priority || 5}/10)</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {analysisResult.extractedSkills?.some((s: any) => s.category === 'NiceToHave' || s.category === 'Nice to Have') && (
                                <div className="space-y-1.5">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nice To Have</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysisResult.extractedSkills.filter((item: any) => item.category === 'NiceToHave' || item.category === 'Nice to Have').map((item: any, i: number) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium border bg-amber-50 text-amber-700 border-amber-100">
                                                • {item.skill} <span className="opacity-40 text-[11px]">({item.priority || 5}/10)</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                                <div className="space-y-1.5">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Red Flags Identified</h4>
                                    <div className="flex flex-col gap-1.5">
                                        {analysisResult.redFlags.map((flag: string, i: number) => (
                                            <span key={i} className="text-xs px-3 py-2 rounded-xl font-medium border bg-rose-50 text-rose-700 border-rose-100 flex items-start gap-2 leading-relaxed">
                                                <span className="shrink-0 mt-0.5">⚠️</span>
                                                <span>{flag}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Interview Target Focus</h4>
                            <ol className="space-y-2 text-xs text-slate-600 font-medium">
                                {analysisResult.focusAreas?.map((area: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2.5 leading-normal">
                                        <span className="text-slate-300 font-extrabold select-none mt-0.5">{i + 1}</span>
                                        <span>{area}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition text-xs uppercase tracking-wide shadow-md mt-4 flex items-center justify-center gap-2.5 text-center"
                    >
                        {isSaving && <Spinner size="sm" colorClass="text-white" />}
                        <span>{isSaving ? 'Syncing to profile...' : 'Save & Track Position →'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
