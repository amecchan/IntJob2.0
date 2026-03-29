import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

const ApplicantProfile = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 mb-8 hover:text-slate-600">
        <ArrowLeftIcon /> Back
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg">
              <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-2xl font-black text-slate-400">
                LD
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                <ChatBubbleIcon /> Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <DownloadIcon /> Resume
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-800">Lew Dew</h1>
          <p className="text-slate-400 font-medium mb-6">Applicant ID: {applicantId}</p>

          <hr className="border-slate-50 mb-6" />

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Qualifications</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Experienced in UI/UX Design and Frontend Development. Skilled in React, Tailwind, and Radix UI.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contact Info</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li><strong>Email:</strong> lewdew@example.com</li>
                <li><strong>Phone:</strong> +63 912 345 6789</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;