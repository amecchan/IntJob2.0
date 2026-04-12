import React, { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase";
import { 
  collection, onSnapshot, query, where, 
  addDoc, serverTimestamp, getDocs, limit,
  doc, updateDoc, increment // <--- ADDED THESE
} from "firebase/firestore";
import { 
  BackpackIcon, CheckIcon, QuestionMarkCircledIcon, 
  PlusIcon, ChatBubbleIcon, PaperPlaneIcon 
} from '@radix-ui/react-icons';
import "../../styles/Applicant/JobCategories.css"; 

const JobCategories = ({ searchTerm, onSwitchView }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [realJobs, setRealJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const jobData = {
    Professionals: ["Project Manager", "Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "Architect", "Field Engineer", "Project Accountant", "Nurse", "Medical Staff", "Dentist", "Piping Engineer", "Administration"],
    "Highly Skilled": ["Electrical Foreman", "Civil Foreman", "Carpenter Foreman", "Plumbing Foreman", "Safety Supervisor", "Machinist", "Scaffolders", "Safety Officer", "Stock Controller"],
    Skilled: ["Carpenter", "Steel Fixer", "Welder", "Plumber", "Electrician", "Cook", "Pipe Fitter", "Mason", "Painter"],
    "Semi-Skilled": ["Carpenter Helper", "Assistant Cook", "Barman", "Waiter", "Laundry Man", "Security Guard", "Laborers", "Factory Worker", "Cleaners"]
  };

  useEffect(() => {
    const q = query(collection(db, "jobs"), where("isActive", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRealJobs(jobs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (jobName) => {
    setSelectedFilters(prev => 
      prev.includes(jobName) ? prev.filter(item => item !== jobName) : [...prev, jobName]
    );
  };

  // --- FUNCTIONALITY: APPLY ---
  const handleApply = async (job) => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to apply.");

  try {
    // 1. (Optional) Fetch the applicant's profile data here if stored elsewhere
    // For now, let's assume we send the necessary profile fields directly:
    
    await addDoc(collection(db, "applications"), {
      jobId: job.id,
      jobTitle: job.title,
      applicantId: user.uid,
      employerId: job.employerId,
      
      // REAL DATA FOR TESTING
      name: user.displayName || "Anonymous Applicant",
      email: user.email,
      phone: "+63 900 000 0000", // Placeholder or from user profile
      bio: "I am a highly motivated individual applying for the " + job.title + " position. I have extensive experience in this field.",
      skills: job.skills || ["Communication", "Punctuality"],
      experience: "2 Years",
      education: "Vocational Degree",
      
      // STATUS & TIMELINE
      status: "NEW", // Match the 'NEW' filter in your ViewApplicants.jsx
      currentStageIndex: 0, 
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
      
      // REQUIREMENTS/RESUME MOCK LINKS
      resumeUrl: "https://example.com/resume.pdf",
      requirements: ["NBI Clearance", "Health Certificate"]
    });

    // 2. Notify Employer
    await addDoc(collection(db, "notifications"), {
      userId: job.employerId,
      title: "New Application",
      message: `${user.displayName || 'Someone'} applied for ${job.title}`,
      isRead: false,
      createdAt: serverTimestamp()
    });

    alert("Application sent successfully! You can now check the Employer Dashboard.");
  } catch (err) {
    console.error(err);
    alert("Failed to apply: " + err.message);
  }
};

  // --- FUNCTIONALITY: INQUIRY ---
  const handleInquiry = async (job) => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to inquire.");

  // Prevent inquiring to yourself
  if (user.uid === job.employerId) return alert("You cannot message yourself.");

  try {
    const chatRef = collection(db, "chats");
    
    // We query to see if a chat with this employer already exists
    const q = query(
      chatRef, 
      where("participants", "array-contains", user.uid)
    );
    
    const snap = await getDocs(q);
    
    // Manual check for the employerId to avoid needing complex Firebase indexes immediately
    const existingChat = snap.docs.find(doc => 
      doc.data().participants.includes(job.employerId)
    );

    if (existingChat) {
      console.log("Chat exists, redirecting...");
      onSwitchView('inbox'); 
    } else {
      console.log("Creating new chat...");
      await addDoc(collection(db, "chats"), {
        participants: [user.uid, job.employerId],
        employerName: job.company || "Hiring Manager",
        lastMessage: "I am interested in the " + job.title + " position.",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      onSwitchView('inbox');
    }
  } catch (err) {
    console.error("Inquiry Error:", err);
    alert("Could not start a conversation: " + err.message);
  }
};

  const filteredResults = realJobs.filter(job => {
    const matchesFilter = selectedFilters.length === 0 || 
                         job.skills?.some(skill => selectedFilters.includes(skill));
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="job-categories-wrapper">
      <div className="job-categories-content">
        <div className="job-container">
          {Object.entries(jobData).map(([category, list]) => (
            <section key={category} className="job-section-card">
              <h2>{category}</h2>
              <div className="skill-grid">
                {list
                  .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(item => {
                    const isSelected = selectedFilters.includes(item);
                    return (
                      <button 
                        key={item}
                        onClick={() => handleToggle(item)}
                        className={`category-pill ${isSelected ? 'active' : ''}`}
                      >
                        <span>{item}</span>
                        {isSelected ? <CheckIcon /> : <PlusIcon className="plus-icon" />}
                      </button>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="results-panel">
        <div className="results-header">
          <BackpackIcon />
          <h3>Real-Time Matches</h3>
          <span className="match-count">{filteredResults.length}</span>
        </div>
        
        <div className="results-body">
          {loading ? (
            <div className="loading-state">Fetching vacancies...</div>
          ) : filteredResults.length > 0 ? (
            <div className="live-job-list">
              {filteredResults.map(job => (
                <div key={job.id} className="live-job-card">
                  <div className="card-top">
                    <span className="company-name">{job.company}</span>
                    <span className="job-salary">₱{job.salary_max}</span>
                  </div>
                  <h4 className="job-title">{job.title}</h4>
                  <p className="job-loc">📍 {job.location}</p>
                  
                  <div className="card-actions">
                    <button className="inquiry-btn" onClick={() => handleInquiry(job)}>
                      <ChatBubbleIcon />
                      <span>Inquiry</span>
                    </button>
                    <button className="apply-now-btn" onClick={() => handleApply(job)}>
                      <PaperPlaneIcon />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <QuestionMarkCircledIcon />
              <p>Select categories on the left to see available real jobs.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default JobCategories;