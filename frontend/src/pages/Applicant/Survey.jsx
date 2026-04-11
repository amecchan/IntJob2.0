import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import "../../styles/Applicant/Survey.css"; 

import { 
  CheckIcon,
  PlusIcon,
  ResetIcon,
  TargetIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons";

const SkillsSurvey = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    status: "",           
    gradeLevel: "",       
    fieldOfStudy: "",     
    selectedSkills: [], 
    categoryOthers: {}, 
    ratings: {
      confidence: null,
      problemSolving: null,
      communication: null,
      realWorld: null,
      motivation: null
    }
  });

  const categories = [
    { id: "tech", name: "Technology & Coding", color: "#1DB954", options: ["Web Development", "Mobile Apps", "Python", "Data Science", "Cybersecurity", "Cloud Computing", "AI/ML", "Software Testing", "DevOps & Automation", "Analytics"] },
    { id: "creative", name: "Arts & Design", color: "#E91E63", options: ["Graphic Design", "Traditional Painting", "UI/UX Design", "Video Editing", "Illustration", "Digital Arts", "Motion Graphics", "Photography", "3D Modeling", "Drawing & Illustration"] },
    { id: "business", name: "Business & Finance", color: "#FF9800", options: ["Marketing", "Entrepreneurship", "Accounting", "Project Management", "Sales", "Digital Marketing", "HR Management", "Finance", "Investment & Banking"] },
    { id: "humanities", name: "Humanities & Social", color: "#0070f3", options: ["Psychology", "Sociology", "Political Science", "Literature", "Public Relations", "Content Writing", "Foreign Languages", "Journalism"] },
    { id: "health", name: "Health & Science", color: "#10b981", options: ["Biology", "Nursing", "Public Health", "Chemistry", "Pharmacy", "Medical Research", "Nutrition", "Bioinformatics"] },
    { id: "soft", name: "Essential Soft Skills", color: "#8b5cf6", options: ["Leadership", "Public Speaking", "Critical Thinking", "Teamwork", "Adaptability", "Time Management", "Emotional Intelligence", "Negotiation"] }
  ];

  const ratingQuestions = [
    { id: "confidence", label: "I feel confident in my current skills and abilities." },
    { id: "problemSolving", label: "I enjoy solving problems and challenges." },
    { id: "communication", label: "I adapt my communication style effectively." },
    { id: "realWorld", label: "I can connect my learning to future goals." },
    { id: "motivation", label: "I stay motivated even when things get difficult." }
  ];

  const toggleCategory = (id) => {
    setActiveCategory(prev => (prev === id ? null : id));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const handleOtherSkillChange = (catId, value) => {
    setFormData(prev => ({
      ...prev,
      categoryOthers: {
        ...prev.categoryOthers,
        [catId]: value
      }
    }));
  };

  const handleRatingChange = (id, value) => {
    setFormData(prev => ({ ...prev, ratings: { ...prev.ratings, [id]: value } }));
  };

  const isBasicsValid = () => {
    const isStatusSelected = formData.status !== "";
    let isSubStatusValid = true;
    if (formData.status === "Student") {
      isSubStatusValid = formData.gradeLevel !== "";
    }
    return isStatusSelected && isSubStatusValid;
  };

  const isDiscoveryValid = () => {
    const hasSelectedChips = formData.selectedSkills.length > 0;
    const hasOtherInput = Object.values(formData.categoryOthers).some(val => val.trim() !== "");
    return hasSelectedChips || hasOtherInput;
  };

  const isRatingStepValid = () => Object.values(formData.ratings).every(v => v !== null);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          ...formData,
          surveyCompleted: true,
          updatedAt: new Date()
        });
        navigate("/applicant/dashboard"); 
        }
      } catch (error) {
        alert("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="survey-container">
      <div className="survey-card">
        {!showResults ? (
          <>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            {/* STEP 1: THE BASICS */}
            {step === 1 && (
              <div className="fade-in">
                <h2>The Basics</h2>
                <p>Which of the following best describes your current status?</p>
                <select 
                  className="input-field" 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value, gradeLevel: ""})}
                >
                  <option value="" hidden>Select Status</option>
                  <option value="Student">Student (currently enrolled)</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Fresh graduate">Fresh graduate</option>
                  <option value="Employed">Employed but looking</option>
                </select>

                {formData.status === "Student" && (
                  <div className="fade-in" style={{ marginTop: '12px' }}>
                    <p className="field-label" style={{ fontSize: '12px' }}>Specify Grade Level:</p>
                    <select className="input-field" value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}>
                      <option value="" hidden>Select Grade Level</option>
                      <option value="Senior High">Senior High</option>
                      <option value="College">College</option>
                    </select>
                  </div>
                )}

                <p className="field-label" style={{ marginTop: '20px', fontSize: '12px' }}>Field of Study (Optional)</p>
                <input className="input-field" placeholder="e.g. STEM, BSIT, Humanities" value={formData.fieldOfStudy} onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})} />
              </div>
            )}

            {/* STEP 2: DISCOVERY */}
            {step === 2 && (
              <div className="fade-in">
                <h2>Discovery</h2>
                <p>Pick a category to select skills. Your choices are saved even when you switch categories.</p>
                
                <div className="spotify-grid">
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      className={`spotify-tile ${activeCategory === cat.id ? 'active' : ''}`}
                      style={{ background: cat.color }}
                      onClick={() => toggleCategory(cat.id)}
                    >
                      <span>{cat.name}</span>
                      {activeCategory === cat.id ? <CheckIcon /> : <PlusIcon />}
                    </div>
                  ))}
                </div>

                {activeCategory && (
                  <div className="sub-options-container fade-in" key={activeCategory}>
                    {(() => {
                      const cat = categories.find(c => c.id === activeCategory);
                      return (
                        <div style={{ marginBottom: '10px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 'bold', color: cat.color, textTransform: 'uppercase', marginBottom: '8px' }}>
                            {cat.name} Skills
                          </p>
                          <div className="chip-container">
                            {cat.options.map(opt => (
                              <div 
                                key={opt} 
                                className={`chip ${formData.selectedSkills.includes(opt) ? 'selected' : ''}`} 
                                onClick={() => toggleSkill(opt)}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: '16px' }}>
                            <input 
                              className="input-field" 
                              style={{ background: 'white', fontSize: '13px', padding: '8px 12px' }}
                              placeholder={`Add other ${cat.name} skills...`}
                              value={formData.categoryOthers[activeCategory] || ""}
                              onChange={(e) => handleOtherSkillChange(activeCategory, e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {(formData.selectedSkills.length > 0 || Object.values(formData.categoryOthers).some(v => v.trim() !== "")) && (
                    <div className="live-summary fade-in">
                        <p className="summary-title">Selected Skills</p>
                        <div className="summary-chips">
                            {formData.selectedSkills.map(skill => (
                                <span key={skill} className="summary-chip" onClick={() => toggleSkill(skill)}>
                                    {skill} <CrossCircledIcon style={{marginLeft: '6px', cursor: 'pointer'}}/>
                                </span>
                            ))}
                            {Object.entries(formData.categoryOthers).map(([catId, text]) => 
                                text.trim() !== "" ? (
                                    <span key={catId} className="summary-chip other" onClick={() => handleOtherSkillChange(catId, "")}>
                                        {text} <CrossCircledIcon style={{marginLeft: '6px', cursor: 'pointer'}}/>
                                    </span>
                                ) : null
                            )}
                        </div>
                    </div>
                )}
              </div>
            )}

            {/* STEP 3: RATINGS */}
            {step === 3 && (
              <div className="fade-in">
                <h2>Self-Assessment</h2>
                <div className="rating-stack">
                  {ratingQuestions.map(q => (
                    <div key={q.id} className="rating-item">
                      <p className="question-text">{q.label}</p>
                      
                      {/* Removed: pop-up rating status label */}

                      <div className="rating-options">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num} 
                            type="button" 
                            className={`rating-circle ${formData.ratings[q.id] === num ? 'active' : ''}`} 
                            onClick={() => handleRatingChange(q.id, num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <div className="rating-hints">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="controls">
              <button onClick={() => setStep(step - 1)} className="btn-ghost" disabled={step === 1}>Back</button>
              <button 
                className="btn-primary" 
                disabled={
                  (step === 1 && !isBasicsValid()) || 
                  (step === 2 && !isDiscoveryValid()) || 
                  (step === 3 && !isRatingStepValid())
                } 
                onClick={() => step < 3 ? setStep(step + 1) : setShowResults(true)}
              >
                {step === 3 ? "See Matches" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div className="results-view fade-in">
             <TargetIcon style={{ width: 48, height: 48, color: "#0051d3", margin: "0 auto" }} />
             <h2>Ready to go!</h2>
             <p style={{fontSize: '14px', color: '#64748b', marginTop: '10px'}}>You've completed the survey. Click finish to save your profile.</p>

             <div className="controls" style={{border: 'none', marginTop: '30px', justifyContent: 'center', gap: '20px'}}>
               <button className="btn-ghost" onClick={() => {setShowResults(false); setStep(2);}}>Review Skills</button>
               <button className="btn-primary" onClick={handleFinish} style={{minWidth: '140px', justifyContent: 'center'}}>
                  {loading ? <ResetIcon className="animate-spin" /> : "Finish Setup"}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSurvey;