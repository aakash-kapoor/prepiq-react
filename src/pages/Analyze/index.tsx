import { useState, useRef } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';

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

    const handleCompanyChange = (value: string) => {
        setCompany(value);
        if (validationError) setValidationError(null);
    };

    const handleJdTextChange = (value: string) => {
        setJdText(value);
        if (validationError) setValidationError(null);
    };

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
                    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            <InputPanel
                company={company}
                jdText={jdText}
                isLoading={isLoading}
                validationError={validationError}
                apiError={apiError}
                successMessage={successMessage}
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
