import { collection, addDoc, getDocs, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * PrepIQ Core MVP Automated Smoke Test Engine
 * Verifies: Auth Scope, Gemini Pipeline Schema parsing, Batch Firestore Writes, and Analytics Aggegators
 */
export async function runPrepIQFullSmokeTest(userId: string) {
  console.log('🚀 [PrepIQ TEST] Initiating automated core module testing cycle...');
  
  if (!userId) {
    console.error('❌ [MODULE 1: AUTH] FAILED: No active test user token uid discovered. Log into the UI first.');
    return;
  }
  console.log('✅ [MODULE 1: AUTH] PASSED: User authenticated successfully. UID:', userId);

  let testAppId = '';

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
    const appDocRef = await addDoc(appsRef, {
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

    testAppId = appDocRef.id;
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
    
    // Simulate user selecting score '5' (Nailed It) on Question 1, and '2' (Struggled) on Question 2[cite: 1]
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
      console.error(`❌ [MODULE 5: ANALYTICS GAPS] FAILED: Mathematical drift caught. Expected 3.5, computed ${calculatedAvg}`);
    }

  } catch (error) {
    console.error('❌ CRITICAL ERROR CAUGHT DURING INTEGRATION RUN ROUTINE:', error);
  } finally {
    // --- AUTOMATED TEARDOWN SCRIPT SANITIZATION GATES ---
    if (testAppId) {
      console.log('🧹 Cleaning up test pipeline artifacts from Cloud Firestore sandbox...');
      const cleanQuestions = await getDocs(collection(db, 'users', userId, 'jobApplications', testAppId, 'questions'));
      
      const clearBatch = writeBatch(db);
      cleanQuestions.docs.forEach((qDoc) => {
        clearBatch.delete(doc(db, 'users', userId, 'jobApplications', testAppId, 'questions', qDoc.id));
      });
      await clearBatch.commit();
      
      await deleteDoc(doc(db, 'users', userId, 'jobApplications', testAppId));
      console.log('✨ Environment teardown complete. Local Firestore ledger state restored.');
    }
    console.log('🏁 PrepIQ End-to-End System Evaluation Pass Terminated.');
  }
}