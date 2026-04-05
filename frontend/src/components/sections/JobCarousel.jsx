import React, { useState, useRef, useEffect } from "react";
import "../../styles/JobCarousel.css";

const JOBS = [
  { id: 1, title: "Full Stack Developer", company: "TechFlow Systems", location: "Remote", type: "Full-time", salary: "₱80k - ₱120k", logo: "https://ui-avatars.com/api/?name=TF&background=02176d&color=fff" },
  { id: 2, title: "Senior UI/UX Designer", company: "Creative Pixel", location: "Manila, PH", type: "Contract", salary: "₱60k - ₱90k", logo: "https://ui-avatars.com/api/?name=CP&background=2563eb&color=fff" },
  { id: 3, title: "Backend Engineer", company: "DataSync Corp", location: "Cebu, PH", type: "Full-time", salary: "Negotiable", logo: "https://ui-avatars.com/api/?name=DS&background=10b981&color=fff" },
  { id: 4, title: "Project Manager", company: "Global Solutions", location: "Hybrid", type: "Full-time", salary: "₱70k+", logo: "https://ui-avatars.com/api/?name=GS&background=f59e0b&color=fff" },
  { id: 5, title: "DevOps Specialist", company: "CloudVibe", location: "Remote", type: "Full-time", salary: "₱100k - ₱150k", logo: "https://ui-avatars.com/api/?name=CV&background=7c3aed&color=fff" },
  { id: 6, title: "Mobile App Developer", company: "Swiftly", location: "Remote", type: "Full-time", salary: "₱85k - ₱130k", logo: "https://ui-avatars.com/api/?name=SW&background=ef4444&color=fff" },
  { id: 7, title: "QA Engineer", company: "CheckPoint", location: "Hybrid", type: "Full-time", salary: "₱50k - ₱80k", logo: "https://ui-avatars.com/api/?name=CK&background=6366f1&color=fff" },
  { id: 8, title: "Data Scientist", company: "Insight AI", location: "Manila, PH", type: "Full-time", salary: "₱110k+", logo: "https://ui-avatars.com/api/?name=IN&background=14b8a6&color=fff" },
];

const JobCarousel = ({ onSignup }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth >= 1024) setVisibleItems(3);
      else if (window.innerWidth >= 640) setVisibleItems(2);
      else setVisibleItems(1);
    };
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const totalPages = JOBS.length - (visibleItems - 1);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth } = scrollRef.current;
      const cardWidth = (scrollWidth / JOBS.length);
      const index = Math.round(scrollLeft / cardWidth);
      if (index < totalPages) setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      let targetIndex = index;
      if (index < 0) targetIndex = totalPages - 1;
      else if (index >= totalPages) targetIndex = 0;

      const cardWidth = (scrollRef.current.scrollWidth / JOBS.length);
      scrollRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: "smooth",
      });
      setActiveIndex(targetIndex);
    }
  };

  return (
    <section className="carousel-section">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#02176d] tracking-tight">Latest Openings</h2>
            <p className="text-gray-500 font-medium text-lg">Find your next career move in the IntJob ecosystem.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-8 bg-blue-600" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollTo(activeIndex - 1)} className="nav-arrow-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => scrollTo(activeIndex + 1)} className="nav-arrow-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-8"
        >
          {JOBS.map((job) => (
            <div key={job.id} onClick={onSignup} className="job-card flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center">
              <div className="job-info-main">
                <div className="card-header">
                  <div className="logo-box">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                  </div>
                  <span className="job-badge">{job.type}</span>
                </div>

                <h3 className="job-title group-hover:text-blue-600">{job.title}</h3>
                <p className="job-company"><span className="text-blue-600">@</span> {job.company}</p>
                <div className="job-salary-tag">{job.salary}</div>
              </div>

              <div className="card-footer">
                <span className="location-text">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {job.location}
                </span>
                <button onClick={(e) => { e.stopPropagation(); onSignup(); }} className="apply-btn">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCarousel;