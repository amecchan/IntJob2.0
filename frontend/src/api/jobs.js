// src/api/jobs.js

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Update this to your Django URL

/**
 * Fetch all jobs submitted by the logged-in employer
 */
export const fetchEmployerJobs = async (token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch jobs');
  }

  return await response.json();
};

/**
 * Create a new job posting with metadata
 */
export const createJob = async (jobData, token) => {
  console.log("Token being sent:", token); // <-- Check if this is empty!
  const response = await fetch(`${API_BASE_URL}/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  // Check content type before parsing as JSON
  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create job');
    } else {
      // This will catch the 404 HTML page and give you a better message
      throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }
  }

  return await response.json();
};

/**
 * Update an existing job post
 */
export const updateJob = async (jobId, jobData, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/`, {
    method: 'PUT', // or 'PATCH' for partial updates
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update job');
  }
  return await response.json();
};

/**
 * Delete a job post
 */
export const deleteJob = async (jobId, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete job');
  }
  return true;
};


export const updateApplicantStatus = async (applicationId, status, token) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update status');
  }
  return await response.json();
};