import { collection, getDocs, writeBatch, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Firestore write batches are capped at 500 operations — stay comfortably
// under that so a heavy user (many questions) never trips the limit.
const BATCH_LIMIT = 450;

/**
 * Deletes everything under users/{uid}/jobApplications/** — every job
 * application doc and its nested questions subcollection.
 *
 * Must be called BEFORE deleteUser(), while the user is still authenticated,
 * since Firestore security rules gate this path on request.auth.uid === uid.
 *
 * Note: PrepIQ currently has no Firebase Storage usage (no resume/JD file
 * uploads), so there's no orphaned Storage data to clean up alongside this.
 */
export async function deleteAllUserData(uid: string): Promise<void> {
  if (!navigator.onLine) {
    throw new Error('Cannot delete while offline');
  }
  const appsRef = collection(db, 'users', uid, 'jobApplications');
  const appsSnap = await getDocs(appsRef);

  for (const appDoc of appsSnap.docs) {
    const questionsRef = collection(
      db,
      'users',
      uid,
      'jobApplications',
      appDoc.id,
      'questions'
    );
    const questionsSnap = await getDocs(questionsRef);

    let batch = writeBatch(db);
    let opCount = 0;

    for (const qDoc of questionsSnap.docs) {
      batch.delete(qDoc.ref);
      opCount++;
      if (opCount === BATCH_LIMIT) {
        await batch.commit();
        batch = writeBatch(db);
        opCount = 0;
      }
    }
    if (opCount > 0) {
      await batch.commit();
    }

    // Delete quizSessions subcollection
    const sessionsRef = collection(db, 'users', uid, 'jobApplications', appDoc.id, 'quizSessions');
    const sessionsSnap = await getDocs(sessionsRef);

    batch = writeBatch(db);
    opCount = 0;

    for (const sDoc of sessionsSnap.docs) {
      batch.delete(sDoc.ref);
      opCount++;
      if (opCount === BATCH_LIMIT) {
        await batch.commit();
        batch = writeBatch(db);
        opCount = 0;
      }
    }
    if (opCount > 0) {
      await batch.commit();
    }

    // Questions and sessions are gone — now remove the job application doc itself.
    await deleteDoc(appDoc.ref);
  }
}

/**
 * Deletes a single job application and all its nested questions and quiz sessions.
 *
 * Mirrors the batched pattern from deleteAllUserData — subcollections first,
 * then the parent doc — so Firestore never has orphaned subcollection data.
 */
export async function deleteJobApplication(uid: string, appId: string): Promise<void> {
  if (!navigator.onLine) {
    throw new Error('Cannot delete while offline');
  }
  const questionsRef = collection(
    db,
    'users',
    uid,
    'jobApplications',
    appId,
    'questions'
  );
  const questionsSnap = await getDocs(questionsRef);

  let batch = writeBatch(db);
  let opCount = 0;

  for (const qDoc of questionsSnap.docs) {
    batch.delete(qDoc.ref);
    opCount++;
    if (opCount === BATCH_LIMIT) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  }
  if (opCount > 0) {
    await batch.commit();
  }

  // Delete quizSessions
  const sessionsRef = collection(
    db,
    'users',
    uid,
    'jobApplications',
    appId,
    'quizSessions'
  );
  const sessionsSnap = await getDocs(sessionsRef);

  batch = writeBatch(db);
  opCount = 0;

  for (const sDoc of sessionsSnap.docs) {
    batch.delete(sDoc.ref);
    opCount++;
    if (opCount === BATCH_LIMIT) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  }
  if (opCount > 0) {
    await batch.commit();
  }

  // Subcollections cleared — delete the application doc itself.
  await deleteDoc(doc(db, 'users', uid, 'jobApplications', appId));
}

/**
 * Deletes a single question from a job application's questions subcollection.
 *
 * Uses a single deleteDoc — no batching needed for one document.
 * Unlike writeBatch, deleteDoc is safe to call offline: Firestore queues
 * the operation locally and syncs it automatically on reconnect.
 */
export async function deleteQuestion(uid: string, appId: string, questionId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'jobApplications', appId, 'questions', questionId));
}