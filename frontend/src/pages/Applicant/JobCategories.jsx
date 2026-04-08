import React, { useState } from "react";
import { BackpackIcon, CheckIcon, QuestionMarkCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import "../../styles/Applicant/JobCategories.css"; 

// --- MASSIVE MOCK DATA: Covers EVERY category role ---
const MOCK_JOBS = [
  // PROFESSIONALS
  { id: 1, title: "Senior Project Manager", company: "Ayala Land", location: "Makati", skills: ["Project Manager"], salary: "80k - 120k" },
  { id: 2, title: "Civil Engineer", company: "Megaworld Corp", location: "Taguig", skills: ["Civil Engineer"], salary: "40k - 55k" },
  { id: 3, title: "Electrical Engineer", company: "Meralco", location: "Manila", skills: ["Electrical Engineer"], salary: "45k - 60k" },
  { id: 4, title: "Mechanical Engineer", company: "San Miguel Corp", location: "Mandaluyong", skills: ["Mechanical Engineer"], salary: "42k - 58k" },
  { id: 5, title: "Design Architect", company: "W.V. Coscolluela", location: "Makati", skills: ["Architect"], salary: "50k - 80k" },
  { id: 6, title: "Field Engineer", company: "EEI Corp", location: "Bulacan", skills: ["Field Engineer"], salary: "35k - 45k" },
  { id: 7, title: "Project Accountant", company: "SGV & Co.", location: "Makati", skills: ["Project Accountant"], salary: "30k - 45k" },
  { id: 8, title: "Staff Nurse", company: "St. Luke's Medical", location: "BGC", skills: ["Nurse"], salary: "32k - 45k" },
  { id: 9, title: "Company Dentist", company: "Healthway", location: "Manila", skills: ["Dentist"], salary: "40k - 60k" },
  { id: 10, title: "Medical Technologist", company: "The Medical City", location: "Pasig", skills: ["Medical Staff"], salary: "28k - 38k" },
  { id: 11, title: "Piping Design Engineer", company: "Fluor Daniel", location: "Alabang", skills: ["Piping Engineer"], salary: "55k - 85k" },
  { id: 12, title: "Admin Officer", company: "SM Investments", location: "Pasay", skills: ["Administration"], salary: "25k - 35k" },

  // HIGHLY SKILLED
  { id: 13, title: "Electrical Foreman", company: "Meralco Industrial", location: "Cavite", skills: ["Electrical Foreman"], salary: "30k - 40k" },
  { id: 14, title: "Safety Supervisor", company: "Shell PH", location: "Batangas", skills: ["Safety Supervisor"], salary: "45k - 65k" },
  { id: 15, title: "Machinist", company: "Mitsubishi Motors", location: "Laguna", skills: ["Machinist"], salary: "25k - 35k" },
  { id: 16, title: "Scaffolding Inspector", company: "Hanjin", location: "Subic", skills: ["Scaffolders"], salary: "28k - 35k" },
  { id: 17, title: "Inventory Controller", company: "Lazada PH", location: "Laguna", skills: ["Stock Controller"], salary: "22k - 30k" },
  { id: 18, title: "Safety Officer", company: "First Gen Corp", location: "Manila", skills: ["Safety Officer"], salary: "35k - 50k" },
  { id: 19, title: "Civil Foreman", company: "Datem Inc.", location: "Quezon City", skills: ["Civil Foreman"], salary: "28k - 38k" },

  // SKILLED
  { id: 20, title: "Senior Welder (6G)", company: "Keppel Philippines", location: "Batangas", skills: ["Welder"], salary: "30k - 45k" },
  { id: 21, title: "Industrial Plumber", company: "Maynilad", location: "Manila", skills: ["Plumber"], salary: "20k - 28k" },
  { id: 22, title: "Executive Chef", company: "Viking's Luxury", location: "Pasay", skills: ["Cook"], salary: "35k - 55k" },
  { id: 23, title: "Master Electrician", company: "BGC Bus", location: "Taguig", skills: ["Electrician"], salary: "25k - 32k" },
  { id: 24, title: "Finishing Painter", company: "DMCI Homes", location: "Manila", skills: ["Painter"], salary: "18k - 25k" },
  { id: 25, title: "Master Carpenter", company: "Landco", location: "Batangas", skills: ["Carpenter"], salary: "20k - 30k" },

  // SEMI-SKILLED
  { id: 26, title: "Service Crew", company: "McDonald's", location: "Manila", skills: ["Waiter", "Assistant Cook"], salary: "15k - 18k" },
  { id: 27, title: "Security Guard", company: "Lanting Security", location: "BGC", skills: ["Security Guard"], salary: "18k - 24k" },
  { id: 28, title: "Laundry Specialist", company: "Solaire Resort", location: "Parañaque", skills: ["Laundry Man"], salary: "16k - 22k" },
  { id: 29, title: "Warehouse Laborer", company: "Shopee PH", location: "Parañaque", skills: ["Laborers"], salary: "15k - 19k" },
  { id: 30, title: "Office Cleaner", company: "Servicemaster", location: "Makati", skills: ["Cleaners"], salary: "14k - 18k" },
  { id: 31, title: "Production Worker", company: "Gardenia PH", location: "Laguna", skills: ["Factory Worker"], salary: "15k - 20k" },
];

const JobCategories = ({ searchTerm }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const jobData = {
    Professionals: ["Project Manager", "Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "Architect", "Field Engineer", "Project Accountant", "Nurse", "Medical Staff", "Dentist", "Piping Engineer", "Administration"],
    "Highly Skilled": ["Electrical Foreman", "Civil Foreman", "Carpenter Foreman", "Plumbing Foreman", "Safety Supervisor", "Machinist", "Scaffolders", "Safety Officer", "Stock Controller"],
    Skilled: ["Carpenter", "Steel Fixer", "Welder", "Plumber", "Electrician", "Cook", "Pipe Fitter", "Mason", "Painter"],
    "Semi-Skilled": ["Carpenter Helper", "Assistant Cook", "Barman", "Waiter", "Laundry Man", "Security Guard", "Laborers", "Factory Worker", "Cleaners"]
  };

  const handleToggle = (jobName) => {
    setSelectedFilters(prev => 
      prev.includes(jobName) ? prev.filter(item => item !== jobName) : [...prev, jobName]
    );
  };

  const filteredResults = MOCK_JOBS.filter(job => 
    selectedFilters.length > 0 && job.skills.some(skill => selectedFilters.includes(skill))
  );

  return (
    <div className="job-categories-wrapper" style={{ display: 'flex', gap: '20px', padding: '10px 20px' }}>
      
      {/* LEFT: Category Selection */}
      <div style={{ flex: '2' }}>
        <div className="job-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
          {Object.entries(jobData).map(([category, list]) => (
            <section key={category} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '15px', color: '#0F2573', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px', fontWeight: 'bold' }}>{category}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {list
                  .filter(job => job.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(job => {
                    const isSelected = selectedFilters.includes(job);
                    return (
                      <button 
                        key={job}
                        onClick={() => handleToggle(job)}
                        style={{ 
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #266CA9' : '1px solid transparent',
                          background: isSelected ? '#e0f2fe' : '#f8fafc',
                          color: isSelected ? '#266CA9' : '#64748b',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {job}
                        {isSelected ? <CheckIcon /> : <PlusIcon style={{ opacity: 0.5 }} />}
                      </button>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* RIGHT: Live Company Results */}
      <div style={{ flex: '0.8', minWidth: '320px', position: 'sticky', top: '20px', alignSelf: 'start' }}>
        <div style={{ background: '#0F2573', color: '#fff', padding: '15px', borderRadius: '12px 12px 0 0' }}>
          <h3 style={{ fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BackpackIcon /> Matches Found
          </h3>
        </div>
        
        <div style={{ background: '#fff', padding: '15px', borderRadius: '0 0 12px 12px', border: '1px solid #e2e8f0', minHeight: '500px', maxHeight: '85vh', overflowY: 'auto' }}>
          {filteredResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredResults.map(job => (
                <div key={job.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', color: '#266CA9', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>{job.company}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0F2573', marginBottom: '2px' }}>{job.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>📍 {job.location}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>₱{job.salary}</span>
                    <button style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#0F2573', color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Apply</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#94a3b8', padding: '0 20px' }}>
              <QuestionMarkCircledIcon width="45" height="45" style={{ marginBottom: '15px', opacity: 0.5 }} />
              <p style={{ fontSize: '13px', lineHeight: '1.6', fontWeight: '500' }}>
                {selectedFilters.length === 0 
                  ? "Select roles on the left to instantly match with top companies like Ayala, Meralco, and more!" 
                  : "We're currently looking for more vacancies in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCategories;