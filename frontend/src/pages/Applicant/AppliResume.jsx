import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useState, useEffect } from 'react';
import { auth } from "../../services/firebase";
import { 
  FileTextIcon, Pencil2Icon, PersonIcon, BackpackIcon, 
  RocketIcon, QuoteIcon, CameraIcon, ImageIcon, 
  ChevronDownIcon, DownloadIcon, PlusIcon, 
  Cross1Icon, TrashIcon
} from '@radix-ui/react-icons';
import "../../styles/Applicant/Resume.css";

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
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // --- AUTOFILL & DRAFT LOADING ---
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setFormData(prev => ({ ...prev, fullName: currentUser.displayName || "", email: currentUser.email || "" }));
      setGooglePhoto(currentUser.photoURL || "");
      setProfilePic(currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=0D8ABC&color=fff`);
    }

    // Load Draft if exists
    const savedDraft = JSON.parse(localStorage.getItem("resume_draft"));
    if (savedDraft) {
      setFormData(savedDraft.formData);
      setSkills(savedDraft.skills);
      setExperiences(savedDraft.experiences);
      setReferences(savedDraft.references);
      setAwardImage(savedDraft.awardImage);
      if(savedDraft.profilePic) setProfilePic(savedDraft.profilePic);
    }
  }, []);

  // --- HANDLERS ---
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

  // --- DRAFT SAVING ---
  const saveDraft = () => {
    const draftData = { formData, skills, experiences, references, awardImage, profilePic };
    localStorage.setItem("resume_draft", JSON.stringify(draftData));
    alert("Draft saved to your browser!");
  };

  // --- DOWNLOAD LOGIC ---
  const downloadAsPDF = async () => {
    const element = document.getElementById('resume-capture-area'); 
    if (!element) return;
    
    // Hide buttons temporarily (Para hindi kasama sa PDF)
    const buttons = element.querySelectorAll('.btn-add-inline, .btn-remove, .btn-add-skill');
    buttons.forEach(btn => btn.style.display = 'none');

    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
    
    // Show buttons back
    buttons.forEach(btn => btn.style.display = 'flex');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.fullName || "Resume"}.pdf`);
  };

  const downloadAsImage = async () => {
    const element = document.getElementById('resume-capture-area');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = `${formData.fullName || "Resume"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="resume-view-wrapper">
      {/* 1. HEADER (OUTSIDE) */}
      <header className="page-main-header">
          <div className="header-info">
            <FileTextIcon width="30" height="30" color="#4cd2f3" />
            <h1>Resume Fill-up Form</h1>
          </div>
          <p>Fill up the form to generate your professional resume.</p>
      </header>

      {/* 2. CAPTURE AREA (THE CLEAN RESUME) */}
      <div id="resume-capture-area" className="resume-form-card animated-fade-in">
        
        {/* PERSONAL INFORMATION */}
        <section className="form-section">
          <h3><PersonIcon /> Personal Information</h3>
          <div className="personal-info-header-block">
            <div className="interactive-photo-picker">
              <div className="profile-preview-wrapper" onClick={() => setShowPhotoMenu(!showPhotoMenu)}>
                <img src={profilePic} alt="Profile" className="profile-main-img" />
                <div className="photo-badge"><CameraIcon /></div>
              </div>
              {showPhotoMenu && (
                <div className="photo-dropdown-menu">
                  <p className="photo-instruction">Source:</p>
                  <div className="menu-options-stack">
                    {googlePhoto && (
                      <button type="button" className="menu-opt-btn" onClick={() => { setProfilePic(googlePhoto); setShowPhotoMenu(false); }}>
                        <img src={googlePhoto} className="small-thumb" alt="google" /> Google Photo
                      </button>
                    )}
                    <label className="menu-opt-btn">
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, setProfilePic)} accept="image/*" />
                      <ImageIcon /> <span>Upload</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="header-contact-fields">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-grid mt-20">
            <div className="input-group span-2">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </section>

        {/* EDUCATIONAL BACKGROUND */}
        <section className="form-section">
          <h3><BackpackIcon /> Educational Background</h3>
          <div className="form-grid">
            <div className="input-group span-2">
              <label>School Name</label>
              <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Degree / Course</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Year Graduated</label>
              <input type="month" name="yearGraduated" value={formData.yearGraduated} onChange={handleChange} />
            </div>
          </div>
          <div className="awards-upload-box">
            <label className="award-label">
              <ImageIcon /> 
              <span>{awardImage ? "Change Award Photo" : "Upload Academic Awards (Optional)"}</span>
              <input type="file" hidden onChange={(e) => handleFileUpload(e, setAwardImage)} accept="image/*" />
            </label>
            {awardImage && <img src={awardImage} className="award-preview" alt="Award Preview" />}
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
            <div key={index} className="dynamic-row-card animated-fade-in">
              <div className="form-grid">
                <div className="input-group">
                  <label>Company Name</label>
                  <input type="text" name="company" value={exp.company} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group">
                  <label>Position / Role</label>
                  <input type="text" name="role" value={exp.role} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group">
                  <label>Duration</label>
                  <input type="text" name="duration" value={exp.duration} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
                </div>
                <div className="input-group span-all">
                  <label>Job Description</label>
                  <textarea name="desc" value={exp.desc} onChange={(e) => handleDynamicChange(index, e, experiences, setExperiences)} />
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
          <div className="skills-input-card animated-fade-in">
            <div className="skills-input-row">
              <div className="input-group" style={{ flex: 1 }}>
                <label>Add New Skill</label>
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()} 
                />
              </div>
              <button type="button" className="btn-add-skill" onClick={addSkill}>
                <PlusIcon /> Add
              </button>
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

        {/* REFERENCES */}
        <section className="form-section">
          <div className="section-header-with-btn">
            <h3><QuoteIcon /> References</h3>
            <button type="button" className="btn-add-inline" onClick={() => addItem(references, setReferences, { name: "", contact: "" })}>
              <PlusIcon /> Add Reference
            </button>
          </div>
          {references.map((ref, index) => (
            <div key={index} className="dynamic-row-card animated-fade-in">
              <div className="form-grid">
                <div className="input-group">
                  <label>Reference Name</label>
                  <input type="text" name="name" value={ref.name} onChange={(e) => handleDynamicChange(index, e, references, setReferences)} />
                </div>
                <div className="input-group">
                  <label>Contact Info</label>
                  <input type="text" name="contact" value={ref.contact} onChange={(e) => handleDynamicChange(index, e, references, setReferences)} />
                </div>
              </div>
              {references.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeItem(index, references, setReferences)}>
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* 3. FLOATING FOOTER ACTIONS */}
      <div className="floating-footer-actions">
        <div className="actions-container">
           <button type="button" className="btn-draft" onClick={saveDraft}>
             <Pencil2Icon /> Save Draft
           </button>
           <div className="save-as-wrapper">
             <button type="button" className="btn-save-as" onClick={() => setShowSaveMenu(!showSaveMenu)}>
               <DownloadIcon /> Save as... <ChevronDownIcon />
             </button>
             {showSaveMenu && (
                <div className="save-dropdown-menu animated-fade-in-up">
                  <div className="save-opt" onClick={downloadAsPDF}>
                    <FileTextIcon /> PDF Document <span>Free</span>
                  </div>
                  <div className="save-opt" onClick={downloadAsImage}>
                    <ImageIcon /> Image (PNG) <span>Free</span>
                  </div>
                </div>
             )}
           </div>
           <button type="button" className="btn-submit">Submit Resume</button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;