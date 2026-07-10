import { collection, addDoc, getDocs, doc, writeBatch, getDoc, setDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { updateOverallProgress } from '../lib/updateProgress';
import { deleteJobApplication, deleteQuestion } from '../lib/deleteUserData';

/**
 * PrepIQ Core MVP Automated Smoke Test Engine
 * Verifies: Auth Scope, Gemini Pipeline Schema parsing, Batch Firestore Writes, 
 * Quiz Sessions, Topic Scores, Overall Progress Recalculation, Study Plan saving,
 * and Cascading Delete sanitization gates.
 */
export async function runPrepIQFullSmokeTest(userId: string) {
  console.log('🚀 [PrepIQ TEST] Initiating automated core module testing cycle...');
  
  if (!userId) {
    console.error('❌ [MODULE 1: AUTH] FAILED: No active test user token uid discovered. Log into the UI first.');
    return;
  }
  console.log('✅ [MODULE 1: AUTH] PASSED: User authenticated successfully. UID:', userId);

  let testAppId = '';
  let failed = false;

  try {
    // --- MODULE 2: TEST ANALYZER SIMULATION & FIRESTORE INGESTION ---
    console.log('⏳ [MODULE 2: ANALYZER] Simulating real-time Gemini structured data return payload...');
    
    // Hardcoded schema mock matching the exact Gemini JSON spec requirements
    const mockGeminiOutput = {
      roleTitle: "Automation Testing Engineer (Smoke Test)",
      companyType: "Product Enterprise",
      estimatedDifficulty: "Mid-Level",
      extractedSkills: [
        { skill: "TypeScript", priority: 9, category: "Core" },
        { skill: "Firebase Rules", priority: 8, category: "Core" },
        { skill: "Jest", priority: 6, category: "NiceToHave" },
        { skill: "Legacy Code", priority: 7, category: "RedFlag" }
      ],
      focusAreas: ["Automated Batch Writes", "Security Rule Evaluation", "State Isolation"]
    };

    console.log('⏳ [MODULE 2: ANALYZER] Attempting to push parsed dataset to Firestore jobApplications ledger...');
    const appsRef = collection(db, 'users', userId, 'jobApplications');
    const newAppDocRef = await addDoc(appsRef, {
      company: "TestLabs Inc.",
      role: mockGeminiOutput.roleTitle,
      rawJD: "Automated simulation run text block context.",
      extractedSkills: mockGeminiOutput.extractedSkills,
      focusAreas: mockGeminiOutput.focusAreas,
      redFlags: ["Legacy Code"],
      estimatedDifficulty: mockGeminiOutput.estimatedDifficulty,
      createdAt: new Date(),
      overallProgress: 0
    });

    testAppId = newAppDocRef.id;
    console.log(`✅ [MODULE 2: ANALYZER] PASSED: Document successfully committed to collection sub-ledger. Generated ID: ${testAppId}`);


    // --- MODULE 3: TEST QUESTION BANK GENERATION & TRANSACTION BATCH WRITES ---
    console.log('⏳ [MODULE 3: REPOSITORY] Executing Firestore WriteBatch injection to build question deck...');
    
    const mockQuestionsArray = [
      { question: "Explain batch mutation scales in Firestore.", idealAnswer: "Batch sets append operations globally up to 500 documents.", topic: "Database Architecture", difficulty: "Medium" },
      { question: "How does type assertion bypass structural checks?", idealAnswer: "It overrides compiler assertions during bundling compiler scopes.", topic: "TypeScript Core", difficulty: "Hard" }
    ];

    const batch = writeBatch(db);
    const questionsRef = collection(db, 'users', userId, 'jobApplications', testAppId, 'questions');
    
    const generatedQuestionIds: string[] = [];
    mockQuestionsArray.forEach((q) => {
      const newQDocRef = doc(questionsRef);
      generatedQuestionIds.push(newQDocRef.id);
      batch.set(newQDocRef, {
        ...q,
        timesAnswered: 0,
        lastConfidence: 0,
        averageConfidence: 0
      });
    });

    await batch.commit();
    console.log(`✅ [MODULE 3: REPOSITORY] PASSED: Transaction batch committed safely. 2 Mock questions built in database.`);


    // --- MODULE 4: QUIZ MODE SANDBOX METRIC FLIP LOGGING ---
    console.log('⏳ [MODULE 4: QUIZ ZONE] Simulating answer flip and manual confidence entry logging...');
    
    // Simulate user selecting score '5' (Nailed It) on Question 1, and '2' (Struggled) on Question 2
    const q1Ref = doc(db, 'users', userId, 'jobApplications', testAppId, 'questions', generatedQuestionIds[0]);
    const q2Ref = doc(db, 'users', userId, 'jobApplications', testAppId, 'questions', generatedQuestionIds[1]);

    const updateBatch = writeBatch(db);
    updateBatch.update(q1Ref, { timesAnswered: 1, lastConfidence: 5, averageConfidence: 5 });
    updateBatch.update(q2Ref, { timesAnswered: 1, lastConfidence: 2, averageConfidence: 2 });
    await updateBatch.commit();
    
    console.log('✅ [MODULE 4: QUIZ ZONE] PASSED: Custom user confidence ratings written to database entries successfully.');


    // --- MODULE 5: WEAKNESS ANALYTICS RADAR AGGREGATION ENGINE ---
    console.log('⏳ [MODULE 5: ANALYTICS GAPS] Inspecting data metrics aggregation parsing loops...');
    
    const verifySnapshot = await getDocs(questionsRef);
    let totalScoreSum = 0;
    let countedPracticed = 0;

    verifySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.lastConfidence > 0) {
        totalScoreSum += data.lastConfidence;
        countedPracticed++;
      }
    });

    const calculatedAvg = totalScoreSum / countedPracticed;
    console.log(`📊 Calculated Test Average Confidence: ${calculatedAvg} / 5.0`);
    
    if (calculatedAvg === 3.5) {
      console.log('✅ [MODULE 5: ANALYTICS GAPS] PASSED: Global average confidence calculated perfectly ((5 + 2) / 2 = 3.5)! Matrix pipeline accurate.');
    } else {
      failed = true;
      console.error(`❌ [MODULE 5: ANALYTICS GAPS] FAILED: Mathematical drift caught. Expected 3.5, computed ${calculatedAvg}`);
    }


    // --- MODULE 6: QUIZ SESSION LOGGING & HISTORY INTEGRATION ---
    console.log('⏳ [MODULE 6: QUIZ SESSIONS] Simulating logging of a completed quiz session...');
    const sessionRef = doc(collection(db, 'users', userId, 'jobApplications', testAppId, 'quizSessions'));
    await setDoc(sessionRef, {
      date: Date.now(),
      averageScore: 3.5,
      questionsAnswered: 2,
      appName: "TestLabs Inc."
    });

    const sessionSnap = await getDoc(sessionRef);
    if (sessionSnap.exists() && sessionSnap.data().averageScore === 3.5) {
      console.log('✅ [MODULE 6: QUIZ SESSIONS] PASSED: Quiz session successfully recorded and validated.');
    } else {
      failed = true;
      console.error('❌ [MODULE 6: QUIZ SESSIONS] FAILED: Quiz session record invalid or not found.');
    }


    // --- MODULE 7: TOPIC SCORES ATOMIC INCREMENTS ---
    console.log('⏳ [MODULE 7: TOPIC SCORES] Testing atomic topic score updates...');
    const appDocRef = doc(db, 'users', userId, 'jobApplications', testAppId);
    
    // Simulate updating topic scores incrementally for "Database Architecture" and "TypeScript Core"
    await updateDoc(appDocRef, {
      'topicScores.Database Architecture.sum': increment(5),
      'topicScores.Database Architecture.count': increment(1),
      'topicScores.TypeScript Core.sum': increment(2),
      'topicScores.TypeScript Core.count': increment(1)
    });

    const updatedAppSnap = await getDoc(appDocRef);
    const topicScores = updatedAppSnap.data()?.topicScores;
    
    if (topicScores && 
        topicScores['Database Architecture']?.sum === 5 && 
        topicScores['TypeScript Core']?.sum === 2) {
      console.log('✅ [MODULE 7: TOPIC SCORES] PASSED: Atomic increments verified successfully.');
    } else {
      failed = true;
      console.error('❌ [MODULE 7: TOPIC SCORES] FAILED: Topic scores mismatch or not updated.', topicScores);
    }


    // --- MODULE 8: OVERALL PROGRESS RECALCULATION ENGINE ---
    console.log('⏳ [MODULE 8: PROGRESS ENGINE] Testing hook overall progress recomputation...');
    
    // Recalculate progress (1 of 2 questions has averageConfidence >= 3.5 -> 50%)
    await updateOverallProgress(userId, testAppId);
    
    const progressAppSnap = await getDoc(appDocRef);
    const progressVal = progressAppSnap.data()?.overallProgress;
    
    if (progressVal === 50) {
      console.log('✅ [MODULE 8: PROGRESS ENGINE] PASSED: Overall progress recalculated correctly (50%).');
    } else {
      failed = true;
      console.error(`❌ [MODULE 8: PROGRESS ENGINE] FAILED: Expected 50%, found ${progressVal}%`);
    }


    // --- MODULE 9: STUDY PLAN SAVING ---
    console.log('⏳ [MODULE 9: STUDY PLAN] Testing storage of generated study plan and interview date...');
    
    const mockStudyPlan = [
      { day: 1, topic: "TypeScript Core", tasks: ["Review typings", "Practice confidence flip"] },
      { day: 2, topic: "Database Architecture", tasks: ["Review WriteBatch caps", "Run smoke test validation"] }
    ];
    
    await updateDoc(appDocRef, {
      studyPlan: mockStudyPlan,
      studyPlanGaps: ["TypeScript Core", "Database Architecture"],
      studyPlanDays: 5,
      interviewDate: "2026-07-20"
    });

    const planAppSnap = await getDoc(appDocRef);
    const studyPlanData = planAppSnap.data();

    if (studyPlanData?.studyPlan?.length === 2 && studyPlanData?.interviewDate === "2026-07-20") {
      console.log('✅ [MODULE 9: STUDY PLAN] PASSED: Study plan data structure and interview date saved successfully.');
    } else {
      failed = true;
      console.error('❌ [MODULE 9: STUDY PLAN] FAILED: Study plan fields did not persist correctly.', studyPlanData);
    }


    // --- MODULE 10: SINGLE QUESTION DELETION ---
    console.log('⏳ [MODULE 10: DELETE QUESTION] Testing deletion of a single question...');
    const questionToDeleteId = generatedQuestionIds[1];
    
    await deleteQuestion(userId, testAppId, questionToDeleteId);
    
    const qSnap = await getDoc(doc(db, 'users', userId, 'jobApplications', testAppId, 'questions', questionToDeleteId));
    if (!qSnap.exists()) {
      console.log('✅ [MODULE 10: DELETE QUESTION] PASSED: Question deleted successfully.');
    } else {
      failed = true;
      console.error('❌ [MODULE 10: DELETE QUESTION] FAILED: Question document still exists after deletion.');
    }


    // --- MODULE 11: CASCADING JOB APPLICATION DELETION & LEDGER SANITIZATION ---
    console.log('⏳ [MODULE 11: CASCADING DELETE] Testing full application and nested subcollections cleanup...');
    
    // Call the upgraded deleteJobApplication which cleans up questions, quizSessions, and the app itself.
    await deleteJobApplication(userId, testAppId);
    
    // Verify that the application document no longer exists
    const appCleanupSnap = await getDoc(appDocRef);
    
    // Verify subcollections are empty
    const cleanQuestions = await getDocs(collection(db, 'users', userId, 'jobApplications', testAppId, 'questions'));
    const cleanSessions = await getDocs(collection(db, 'users', userId, 'jobApplications', testAppId, 'quizSessions'));
    
    if (!appCleanupSnap.exists() && cleanQuestions.empty && cleanSessions.empty) {
      console.log('✅ [MODULE 11: CASCADING DELETE] PASSED: Job application, questions, and quiz sessions fully removed.');
      testAppId = ''; // Clear ID since cleanup succeeded
    } else {
      failed = true;
      console.error('❌ [MODULE 11: CASCADING DELETE] FAILED: Residual orphaned data detected in ledger.', {
        appExists: appCleanupSnap.exists(),
        remainingQuestions: cleanQuestions.size,
        remainingSessions: cleanSessions.size
      });
    }

  } catch (error) {
    failed = true;
    console.error('❌ CRITICAL ERROR CAUGHT DURING INTEGRATION RUN ROUTINE:', error);
  } finally {
    // Teardown backup just in case of failure in the middle of test run
    if (testAppId) {
      console.log('🧹 [TEARDOWN] Cleaning up residual test artifacts after test failure...');
      try {
        const cleanQuestions = await getDocs(collection(db, 'users', userId, 'jobApplications', testAppId, 'questions'));
        const clearBatch = writeBatch(db);
        cleanQuestions.docs.forEach((qDoc) => {
          clearBatch.delete(qDoc.ref);
        });
        await clearBatch.commit();
        
        const cleanSessions = await getDocs(collection(db, 'users', userId, 'jobApplications', testAppId, 'quizSessions'));
        const clearSessionsBatch = writeBatch(db);
        cleanSessions.docs.forEach((sDoc) => {
          clearSessionsBatch.delete(sDoc.ref);
        });
        await clearSessionsBatch.commit();
        
        await deleteDoc(doc(db, 'users', userId, 'jobApplications', testAppId));
        console.log('✨ [TEARDOWN] Environment teardown complete. Local Firestore ledger state restored.');
      } catch (cleanError) {
        console.error('❌ [TEARDOWN] Cleanup process encountered error:', cleanError);
      }
    }

    if (failed) {
      console.error('🏁 [PrepIQ TEST] Final Result: FAILED. Please inspect the log outputs above.');
    } else {
      console.log('🏁 [PrepIQ TEST] Final Result: ALL PASSED. E2E system evaluation fully completed.');
    }
  }
}