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

    // Questions are gone — now remove the job application doc itself.
    await deleteDoc(appDoc.ref);
  }
}

/**
 * Deletes a single job application and all its nested questions.
 *
 * Mirrors the batched pattern from deleteAllUserData — questions first,
 * then the parent doc — so Firestore never has orphaned subcollection data.
 */
export async function deleteJobApplication(uid: string, appId: string): Promise<void> {
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

  // Questions subcollection cleared — delete the application doc itself.
  await deleteDoc(doc(db, 'users', uid, 'jobApplications', appId));
}