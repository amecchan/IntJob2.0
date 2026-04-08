import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Fetch jobs specifically for the logged-in employer
 */
export const fetchEmployerJobs = async (userId) => {
  const q = query(
    collection(db, "jobs"),
    where("employerId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Create a new job posting
 */
export const createJob = async (jobData, userId) => {
  return await addDoc(collection(db, "jobs"), {
    ...jobData,
    employerId: userId, // Link job to the creator
    isActive: true,
    applicantCount: 0,
    createdAt: serverTimestamp()
  });
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId, jobData) => {
  const jobRef = doc(db, "jobs", jobId);
  return await updateDoc(jobRef, {
    ...jobData,
    updatedAt: serverTimestamp()
  });
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId) => {
  const jobRef = doc(db, "jobs", jobId);
  return await deleteDoc(jobRef);
};

/**
 * Update Applicant Status (Real-time in Firestore)
 */
export const updateApplicantStatus = async (applicationId, status) => {
  const appRef = doc(db, "applications", applicationId);
  return await updateDoc(appRef, { 
    status,
    updatedAt: serverTimestamp() 
  });
};