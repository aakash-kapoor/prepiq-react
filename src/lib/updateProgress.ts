import { collection, getDocs, getDocsFromCache, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Recomputes and persists overallProgress for a single job application.
 *
 * Formula: (questions with averageConfidence >= 3.5) / totalQuestions * 100
 *
 * A question at 3.5+ means the user has consistently rated themselves
 * confident on it — a meaningful signal that the topic is "learned".
 * Questions that have never been answered (averageConfidence === 0) are
 * counted as not yet learned, keeping the metric honest.
 *
 * Called after every quiz session save so the dashboard always reflects
 * the user's current state without a manual refresh.
 */
export async function updateOverallProgress(uid: string, appId: string): Promise<void> {
  const questionsRef = collection(db, 'users', uid, 'jobApplications', appId, 'questions');
  
  let snapshot;
  if (!navigator.onLine) {
    try {
      snapshot = await getDocsFromCache(questionsRef);
    } catch (err) {
      console.warn('Failed to load questions from cache for progress recalculation:', err);
      return;
    }
  } else {
    snapshot = await getDocs(questionsRef);
  }

  if (snapshot.empty) return;

  const total = snapshot.size;
  const learned = snapshot.docs.filter(d => {
    const avg = d.data().averageConfidence ?? 0;
    return avg >= 3.5;
  }).length;

  const progress = Math.round((learned / total) * 100);

  await updateDoc(doc(db, 'users', uid, 'jobApplications', appId), {
    overallProgress: progress,
  });
}