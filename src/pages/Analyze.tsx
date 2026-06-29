import { useState, useRef } from 'react';
import { useGemini } from '../hooks/useGemini';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Analyze() {
    const [jdText, setJdText] = useState('');
    const [company, setCompany] = useState('');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const { analyzeJobDescription, isLoading, error: apiError } = useGemini();
    const { user } = useAuth();

    const resultsSectionRef = useRef<HTMLDivElement>(null);

    const handleRunAnalysis = async () => {
        setValidationError(null);
        setSuccessMessage(null);

        if (!company.trim()) {
            setValidationError('⚠️ Company Name cannot be left blank.');
            return;
        }
        if (!jdText.trim() || jdText.trim().length < 50) {
            setValidationError('⚠️ Please paste a comprehensive job description (minimum 50 characters) to analyze.');
            return;
        }

        const data = await analyzeJobDescription(jdText);
        if (data) {
            setAnalysisResult(data);
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    resultsSectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
           
        }
    };

    const handleSaveToDashboard = async () => {
        if (!user || !analysisResult) return;
        setIsSaving(true);
        setValidationError(null);
        setSuccessMessage(null);

        try {
            const jobApplicationsRef = collection(db, 'users', user.uid, 'jobApplications');
            await addDoc(jobApplicationsRef, {
                company: company,
                role: analysisResult.roleTitle || 'Software Engineer',
                rawJD: jdText,
                extractedSkills: analysisResult.extractedSkills || [],
                focusAreas: analysisResult.focusAreas || [],
                redFlags: analysisResult.redFlags || [],
                estimatedDifficulty: analysisResult.estimatedDifficulty || 'Mid-Level',
                createdAt: serverTimestamp(),
                overallProgress: 0
            });
            
            // Set toast confirmation state
            setSuccessMessage(`🎉 ${analysisResult.roleTitle || 'Position'} track successfully saved to your workspace layout!`);
            setJdText('');
            setCompany('');
            setAnalysisResult(null);
        } catch (err) {
            console.error('Firestore save failed:', err);
            setValidationError('❌ Database synchronization failed. Please inspect your connection parameters.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-stretch">

            {/* LEFT PANEL: Source Inputs card */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-4 flex-1 flex flex-col">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mt-1">Analyze New Role</h2>
                        <p className="text-xs text-slate-400 font-medium">Paste the company details and job description to extract core priorities.</p>
                    </div>

                    {/* DYNAMIC ERROR STATUS NOTIFICATION BANNER */}
                    {(validationError || apiError) && (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-medium animate-fadeIn">
                            {validationError || apiError}
                        </div>
                    )}

                    {/* DYNAMIC SUCCESS NOTIFICATION BANNER */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold animate-fadeIn">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Company Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Google, Stripe, Local Startup"
                            className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition font-medium"
                            value={company}
                            onChange={(e) => {
                                setCompany(e.target.value);
                                if (validationError) setValidationError(null); // Clear error instantly when typing
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-h-[320px]">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Job Description Text</label>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-xl text-xs outline-none resize-none flex-1 focus:ring-1 focus:ring-indigo-500 transition font-medium leading-relaxed"
                            placeholder="Paste everything from the job posting..."
                            value={jdText}
                            onChange={(e) => {
                                setJdText(e.target.value);
                                if (validationError) setValidationError(null); // Clear error instantly when typing
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleRunAnalysis}
                    disabled={isLoading}
                    className="w-full bg-[#6366F1] hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 text-xs uppercase tracking-wider shadow-md shadow-indigo-500/10 mt-2"
                >
                    {isLoading ? 'Running secure tokenization extraction...' : '🔒 SECURE ENCRYPT & ANALYZE'}
                </button>
            </div>

            {/* RIGHT PANEL: Extracted Blueprint Analysis Outputs */}
            <div ref={resultsSectionRef}
             className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between min-h-[200px] lg:min-h-[500px] scroll-mt-5">
                {!analysisResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 my-auto">
                        <span className="text-4xl mb-2">🤖</span>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Awaiting Source Upload Payload</p>
                        <p className="text-xs max-w-xs mt-1 text-slate-400">Your live system tags and structural data blueprint metrics generate right here.</p>
                    </div>
                ) : (
                    <div className="space-y-6 h-full flex flex-col justify-between">
                        <div className="space-y-5">
                            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                        🟢 Analysis Complete ✓
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">{analysisResult.roleTitle || 'Ionic Angular Developer'}</h3>
                                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide">Targeting: {analysisResult.companyType || 'Generic Tech Company/Agency'}</p>
                                </div>
                                <span className="text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                                    {analysisResult.estimatedDifficulty || 'Mid-Level'}
                                </span>
                            </div>

                            {/* DYNAMICALLY CATEGORIZED SKILLS BLUEPRINT */}
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
                                onClick={handleSaveToDashboard}
                                disabled={isSaving}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition text-xs uppercase tracking-wide shadow-md mt-4"
                            >
                                {isSaving ? 'Syncing to profile...' : 'Save & Track Position →'}
                            </button>
                    </div>
                )}
            </div>
        </div>
    );
}