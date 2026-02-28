import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from "firebase/firestore";

export const firestoreService = {
    // Study Sessions
    async saveStudySession(sessionData) {
        try {
            const docRef = await addDoc(collection(db, "study_sessions"), {
                ...sessionData,
                timestamp: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    },

    async getStudySessions(userId) {
        try {
            const q = query(
                collection(db, "study_sessions"),
                where("user_id", "==", userId),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    },

    // Quiz Results
    async saveQuizResult(resultData) {
        try {
            const docRef = await addDoc(collection(db, "quiz_results"), {
                ...resultData,
                timestamp: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding quiz result: ", error);
            throw error;
        }
    },

    async getQuizResults(userId) {
        try {
            const q = query(
                collection(db, "quiz_results"),
                where("user_id", "==", userId),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting quiz results: ", error);
            throw error;
        }
    }
};
