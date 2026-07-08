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
    const [interviewDate, setInterviewDate] = useState('');
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

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

    const minDate = today.toISOString().split("T")[0];

    const handleInterviewDateChange = (value: string) => {
        if (!value) {
            setInterviewDate("");
            return;
        }

        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
            showErrorToast("Please enter a valid interview date.");
            setInterviewDate("");
            return;
        }

        if (value < minDate) {
            showErrorToast("Interview date cannot be in the past.");
            return;
        }

        setInterviewDate(value);
    };

    const handleRunAnalysis = async () => {
        if (!navigator.onLine) {
            showErrorToast('You\'re offline. Connect to the internet to analyze your job description.');
            return;
        }
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
            showSuccessToast('Analysis complete.');
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // `apiError` is React state — it may not have flushed yet after the await.
            // The hook always sets error before returning null, so we read it via the
            // module-level `apiError` ref as a best-effort, with a safe fallback message.
            showErrorToast(apiError || 'Analysis failed. Check your API key or connection and try again.');
        }
    };

    const handleSaveToDashboard = async () => {
        if (!user || !analysisResult) return;

        const appData = {
            company,
            role: analysisResult.roleTitle || 'Software Engineer',
            rawJD: jdText,
            extractedSkills: analysisResult.extractedSkills || [],
            focusAreas: analysisResult.focusAreas || [],
            redFlags: analysisResult.redFlags || [],
            estimatedDifficulty: analysisResult.estimatedDifficulty || 'Mid-Level',
            createdAt: serverTimestamp(),
            overallProgress: 0,
            ...(interviewDate ? { interviewDate } : {}),
        };

        const jobApplicationsRef = collection(db, 'users', user.uid, 'jobApplications');

        if (!navigator.onLine) {
            addDoc(jobApplicationsRef, appData).catch(err => {
                console.error('Offline save failed:', err);
            });
            showSuccessToast(`${analysisResult.roleTitle || 'Role'} saved offline — your changes will sync automatically when you're back online.`);
            setJdText('');
            setCompany('');
            setInterviewDate('');
            setAnalysisResult(null);
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(jobApplicationsRef, appData);
            showSuccessToast(`${analysisResult.roleTitle || 'Role'} saved — ready to build questions.`);
            setJdText('');
            setCompany('');
            setInterviewDate('');
            setAnalysisResult(null);
        } catch (err) {
            console.error('Firestore save failed:', err);
            showErrorToast('Failed to save. Please check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-stretch">
            <InputPanel
                company={company}
                jdText={jdText}
                interviewDate={interviewDate}
                isLoading={isLoading}
                onCompanyChange={handleCompanyChange}
                onJdTextChange={handleJdTextChange}
                onInterviewDateChange={handleInterviewDateChange}
                onAnalyze={handleRunAnalysis}
            />
            <ResultsPanel
                analysisResult={analysisResult}
                isLoading={isLoading}
                isSaving={isSaving}
                panelRef={resultsSectionRef}
                onSave={handleSaveToDashboard}
            />
        </div>
    );
}