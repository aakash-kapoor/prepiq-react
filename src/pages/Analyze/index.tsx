import { useState, useRef } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { showSuccessToast, showErrorToast } from '../../lib/toast';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';

export default function Analyze() {
    const [jdText, setJdText] = useState('');
    const [company, setCompany] = useState('');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { analyzeJobDescription, isLoading, error: apiError } = useGemini();
    const { user } = useAuth();
    const resultsSectionRef = useRef<HTMLDivElement>(null);

    const handleCompanyChange = (value: string) => {
        setCompany(value);
    };

    const handleJdTextChange = (value: string) => {
        setJdText(value);
    };

    const handleRunAnalysis = async () => {
        if (!company.trim()) {
            showErrorToast('Company Name cannot be left blank.');
            return;
        }
        if (!jdText.trim() || jdText.trim().length < 50) {
            showErrorToast('Please paste a comprehensive job description (minimum 50 characters) to analyze.');
            return;
        }
        if (jdText.trim().length > 8000) {
            showErrorToast('Job description is too long. Please paste under 8,000 characters.');
            return;
        }

        const data = await analyzeJobDescription(jdText);
        if (data) {
            setAnalysisResult(data);
            showSuccessToast('Analysis complete — review your results below.');
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else if (apiError) {
            showErrorToast(apiError);
        }
    };

    const handleSaveToDashboard = async () => {
        if (!user || !analysisResult) return;
        setIsSaving(true);

        try {
            const jobApplicationsRef = collection(db, 'users', user.uid, 'jobApplications');
            await addDoc(jobApplicationsRef, {
                company,
                role: analysisResult.roleTitle || 'Software Engineer',
                rawJD: jdText,
                extractedSkills: analysisResult.extractedSkills || [],
                focusAreas: analysisResult.focusAreas || [],
                redFlags: analysisResult.redFlags || [],
                estimatedDifficulty: analysisResult.estimatedDifficulty || 'Mid-Level',
                createdAt: serverTimestamp(),
                overallProgress: 0,
            });
            showSuccessToast(`${analysisResult.roleTitle || 'Position'} saved to your workspace.`);
            setJdText('');
            setCompany('');
            setAnalysisResult(null);
        } catch (err) {
            console.error('Firestore save failed:', err);
            showErrorToast('Database synchronization failed. Please check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-stretch">
            <InputPanel
                company={company}
                jdText={jdText}
                isLoading={isLoading}
                onCompanyChange={handleCompanyChange}
                onJdTextChange={handleJdTextChange}
                onAnalyze={handleRunAnalysis}
            />
            <ResultsPanel
                analysisResult={analysisResult}
                isSaving={isSaving}
                panelRef={resultsSectionRef}
                onSave={handleSaveToDashboard}
            />
        </div>
    );
}
