import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface TimelineDay {
  dayNumber: number;
  title: string;
  focusTopics: string[];
  type: 'review' | 'mock' | 'final';
  description: string;
}

export interface JobApp {
  id: string;
  company: string;
  role: string;
  interviewDate?: string;
  studyPlan?: TimelineDay[];
  studyPlanGaps?: string[];
  studyPlanDays?: number;
  topicScores?: { [topic: string]: { sum: number; count: number } };
  overallProgress?: number;
  estimatedDifficulty?: string;
  focusAreas?: string[];
}

interface JobApplicationContextType {
  applications: JobApp[];
  loading: boolean;
}

const JobApplicationContext = createContext<JobApplicationContextType>({
  applications: [],
  loading: true,
});

export const useJobApplications = () => useContext(JobApplicationContext);

export const JobApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const appsRef = collection(db, 'users', user.uid, 'jobApplications');
    const unsubscribe = onSnapshot(
      appsRef,
      { includeMetadataChanges: false },
      (snapshot) => {
        const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as JobApp));
        setApplications(apps);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching job applications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <JobApplicationContext.Provider value={{ applications, loading }}>
      {children}
    </JobApplicationContext.Provider>
  );
};
