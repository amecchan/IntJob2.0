import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { storage, db } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "../../contexts/ToastContext"; // Assuming you have this
import { 
  FileTextIcon, Pencil2Icon, PersonIcon, BackpackIcon, 
  RocketIcon, QuoteIcon, CameraIcon, ImageIcon, 
  ChevronDownIcon, DownloadIcon, PlusIcon, 
  Cross1Icon, TrashIcon, CheckIcon
} from '@radix-ui/react-icons';

import "../../styles/Applicant/Resume.css";

// Dynamic Helpers
import { extractTextFromPDF } from "../../services/pdfHelper";
import { parseResumeWithAI } from "../../services/aiParser";

const ResumeForm = () => {
  // --- STATES ---
  const [formData, setFormData] = useState({
    fullName: "", email: "", phoneNumber: "", address: "", dob: "", gender: "",
    schoolName: "", degree: "", yearGraduated: "",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [experiences, setExperiences] = useState([{ company: "", role: "", duration: "", desc: "" }]);
  const [references, setReferences] = useState([{ name: "", contact: "" }]);
  const [awardImage, setAwardImage] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [googlePhoto, setGooglePhoto] = useState("");
  
  // UI State
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- INITIALIZATION & DRAFT LOADING ---
  useEffect(() => {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      setFormData(prev => ({ 
        ...prev, 
        fullName: prev.fullName || currentUser.displayName || "", 
        email: prev.email || currentUser.email || "" 
      }));
      setGooglePhoto(currentUser.photoURL || "");
      
      const initialAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=0D8ABC&color=fff`;
      setProfilePic(prev => prev || currentUser.photoURL || initialAvatar);
    }

    const savedData = localStorage.getItem("resume_draft");
    if (savedData && savedData !== "undefined") {
      try {
        const parsedDraft = JSON.parse(savedData);
        if (parsedDraft.formData) setFormData(prev => ({ ...prev, ...parsedDraft.formData }));
        if (parsedDraft.skills) setSkills(parsedDraft.skills || []);
        if (parsedDraft.experiences) setExperiences(parsedDraft.experiences || []);
        if (parsedDraft.references) setReferences(parsedDraft.references || []);
        if (parsedDraft.profilePic) setProfilePic(parsedDraft.profilePic);
        if (parsedDraft.awardImage) setAwardImage(parsedDraft.awardImage);
      } catch (err) {
        console.error("Failed to parse draft:", err);
      }
    }
  }, []);

  // --- AI HANDLER ---
  const handleAIAutofill = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const rawText = await extractTextFromPDF(file);
      
      if (!rawText || rawText.trim().length === 0) {
        throw new Error("PDF yielded no text. Is it a scanned image?");
      }

      const aiResults = await parseResumeWithAI(rawText);

      // Fix for the yyyy-MM error: append -01 if only year is provided
      const formattedYear = aiResults.yearGraduated && aiResults.yearGraduated.toString().length === 4 
        ? `${aiResults.yearGraduated}-01` 
        : aiResults.yearGraduated;

      setFormData(prev => ({ 
        ...prev, 
        ...aiResults,
        yearGraduated: formattedYear || prev.yearGraduated
      }));

      if (aiResults.skills && Array.isArray(aiResults.skills)) setSkills(aiResults.skills);
      if (aiResults.experiences && Array.isArray(aiResults.experiences)) setExperiences(aiResults.experiences);
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI was unable to parse this file format.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (index, e, state, setState) => {
    const newItems = [...state];
    newItems[index][e.target.name] = e.target.value;
    setState(newItems);
  };

  const addItem = (state, setState, template) => setState([...state, template]);
  const removeItem = (index, state, setState) => setState(state.filter((_, i) => i !== index));

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveDraft = () => {
    const draftData = { formData, skills, experiences, references, awardImage, profilePic };
    localStorage.setItem("resume_draft", JSON.stringify(draftData));
    alert("Progress saved!");
  };

  // --- EXPORT FUNCTIONS ---
  const downloadAsPDF = async () => {
    const element = document.getElementById('resume-capture-area'); 
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.fullName || "Resume"}.pdf`);
    setShowSaveMenu(false);
  };

  return (
    <div className="resume-view-wrapper">
      <header className="page-main-header">
        <div className="header-info">
          <FileTextIcon width="32" height="32" color="#4cd2f3" />
          <h1>Resume Builder</h1>
        </div>
        <p>Craft your professional identity or let our AI do the heavy lifting.</p>
      </header>

      {/* AI HERO SECTION */}
      <div className="ai-autofill-section">
        <div className={`ai-card ${loading ? 'loading-pulse' : ''}`}>
          <div className="ai-icon-box">
             <RocketIcon width="24" height="24" color="white" />
          </div>
          <div className="ai-text">
            <strong>AI Smart Import</strong>
            <p>{loading ? "Analyzing your resume... please wait." : "Upload PDF to instantly fill your profile details."}</p>
          </div>
          <label className={`ai-upload-label ${loading ? 'disabled' : ''}`}>
            {loading ? <span className="loader-text">Processing...</span> : <>Import PDF <PlusIcon /></>}
            <input type="file" hidden accept=".pdf" onChange={handleAIAutofill} disabled={loading} />
          </label>
        </div>
      </div>

      <div id="resume-capture-area" className="resume-form-card">
        
        {/* PERSONAL INFORMATION */}
        <section className="form-section">
          <h3><PersonIcon /> Personal Information</h3>
          <div className="personal-info-header-block">
            <div className="interactive-photo-picker">
              <div className="profile-preview-wrapper" onClick={() => setShowPhotoMenu(!showPhotoMenu)}>
                <img 
                  src={profilePic || 'https://via.placeholder.com/150'} 
                  className="profile-main-img"
                  alt="Profile" 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
                />
                <div className="photo-badge"><CameraIcon /></div>
              </div>
              {showPhotoMenu && (
                <div className="photo-dropdown-menu animated-fade-in">
                  <p className="photo-instruction">Photo Source</p>
                  <div className="menu-options-stack">
                    {googlePhoto && (
                      <button type="button" className="menu-opt-btn" onClick={() => { setProfilePic(googlePhoto); setShowPhotoMenu(false); }}>
                        <img src={googlePhoto} className="small-thumb" alt="google" /> Use Google Photo
                      </button>
                    )}
                    <label className="menu-opt-btn">
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, setProfilePic)} accept="image/*" />
                      <ImageIcon /> <span>Upload Local File</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="header-contact-fields">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} placeholder="Juan Dela Cruz" onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} placeholder="juan@example.com" onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} placeholder="+63 9xx..." onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group span-all">
              <label>Current Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="form-section">
          <h3><BackpackIcon /> Education</h3>
          <div className="form-grid">
            <div className="input-group span-all">
              <label>School/University</label>
              <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Degree / Program</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Graduation Date</label>
              <input type="text" name="yearGraduated" placeholder="YYYY-MM" value={formData.yearGraduated} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section className="form-section">
          <div className="section-header-with-btn">
            <h3><RocketIcon /> Work Experience</h3>
            <button type="button" className="btn-add-inline" onClick={() => addItem(experiences, setExperiences, { company: "", role: "", duration: "", desc: "" })}>
              <PlusIcon /> Add Experience
            </button>
          </div>
          {experiences.map((exp, index) => (
            <div key={index} className="dynamic-row-card">
              <div className="form-grid">
                <div className="input-group">
                  <label>Company</label>
                  <input type="text" name="company" value={exp.company} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group">
                  <label>Position</label>
                  <input type="text" name="role" value={exp.role} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group span-all">
                  <label>Duration (e.g., Jan 2020 - Present)</label>
                  <input type="text" name="duration" value={exp.duration} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group span-all">
                  <label>Key Responsibilities</label>
                  <textarea name="desc" value={exp.desc} rows="3" onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
              </div>
              {experiences.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeItem(index, experiences, setExperiences)}>
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </section>

        {/* SKILLS */}
        <section className="form-section">
          <h3><Pencil2Icon /> Skills & Expertise</h3>
          <div className="skills-input-card">
            <div className="skills-input-row">
              <input 
                type="text" 
                placeholder="e.g. React.js, Project Management..."
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
              />
              <button type="button" className="btn-add-skill" onClick={addSkill}>Add</button>
            </div>
            <div className="skills-tags-display mt-20">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeItem(index, skills, setSkills)}>
                    <Cross1Icon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section className="form-section">
          <h3><CheckIcon /> Certifications & Awards</h3>
          <div className="awards-upload-box">
             <label className="award-label">
                <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, setAwardImage)} />
                <ImageIcon /> {awardImage ? "Change Certificate" : "Upload Certificate/Award Image"}
             </label>
             {awardImage && <img src={awardImage} className="award-preview" alt="Award" />}
          </div>
        </section>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="floating-footer-actions">
        <div className="actions-container">
           <button type="button" className="btn-draft" onClick={saveDraft}>
             <Pencil2Icon /> Save Draft
           </button>
           
           <div className="save-as-wrapper">
             <button type="button" className="btn-save-as" onClick={() => setShowSaveMenu(!showSaveMenu)}>
               <DownloadIcon /> Export Resume <ChevronDownIcon />
             </button>
             {showSaveMenu && (
                <div className="save-dropdown-menu animated-fade-in">
                  <div className="save-opt" onClick={downloadAsPDF}><FileTextIcon /> Download PDF</div>
                  <div className="save-opt" onClick={() => { /* logic for image */ setShowSaveMenu(false); }}><ImageIcon /> Download Image</div>
                </div>
             )}
           </div>
           
           <button type="button" className="btn-submit">Complete Application</button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;