import React from "react";
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import "../../styles/Applicant/Inbox.css";

const Inbox = () => {
  return (
    <div className="inbox-page">
      <div className="inbox-wrapper">
        
        {/* Left Message List */}
        <aside className="message-list">
          <div className="message-item active">
            <div className="msg-info">
              <h4>Company HR</h4>
              <p>We received your application for Engineer...</p>
            </div>
            <span className="time">2h</span>
          </div>

          <div className="message-item">
            <div className="msg-info">
              <h4>IntJob Support</h4>
              <p>Your profile has been updated successfully.</p>
            </div>
            <span className="time">5h</span>
          </div>

          <div className="message-item">
            <div className="msg-info">
              <h4>Recruiter A</h4>
              <p>Please send your updated resume...</p>
            </div>
            <span className="time">1d</span>
          </div>
        </aside>

        {/* Right Message Content */}
        <section className="chat-view">
          <div className="chat-header">
            <div className="chat-user-details">
              <h2>Company HR</h2>
              <span className="status-subtext">Project Engineer Application</span>
            </div>
            <button className="reply-btn">
               <PaperPlaneIcon /> <span>Reply</span>
            </button>
          </div>

          <div className="chat-body">
            {/* Wrapper for the bubble to handle alignment */}
            <div className="chat-bubble received">
              <p>Hello! We’ve reviewed your resume. Can you join a quick interview this week?</p>
              <span className="timestamp">2:30 PM</span>
            </div>

            <div className="chat-bubble sent">
              <p>Yes, I’m available. What time works for you?</p>
              <span className="timestamp">2:45 PM</span>
            </div>
          </div>

          {/* This container must stay pinned to the bottom */}
          <div className="chat-input-container">
            <input type="text" placeholder="Type a message..." />
            <button className="send-btn">
              <PaperPlaneIcon />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inbox;