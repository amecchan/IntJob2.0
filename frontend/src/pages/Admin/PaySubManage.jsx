import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Users, Clock, Coins, Star, ListFilter, 
  CheckCircle2, XCircle, Eye, Receipt, FileText, RefreshCw
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/PaySubManage.css';

const PaySubManage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // --- DATABASE READY STATES ---
  const [subscriptions, setSubscriptions] = useState([]);
  const [pendingProofs, setPendingProofs] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [summary, setSummary] = useState({
    activeSubscribers: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    premiumEmployers: 0
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = () => {
    setIsLoading(true);
    // Dito papasok ang Firebase logic mo mamaya
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="paysub-container">
      <header className="paysub-header">
        <div className="header-title-row">
          <h1>
            <CreditCard size={28} className="header-icon" /> Payment & Subscription Management
          </h1>
          <button className="btn-refresh-sync" onClick={fetchPaymentData} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "spin-icon" : ""} />
            {isLoading ? "Syncing..." : "Sync Database"}
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="paysub-stats-grid">
        <div className="paysub-stat-card">
          <Users size={26} className="icon-blue" />
          <h3>Active Subscribers</h3>
          <p>{summary.activeSubscribers} Employers</p>
        </div>
        <div className="paysub-stat-card">
          <Clock size={26} className="icon-orange" />
          <h3>Pending Approvals</h3>
          <p>{summary.pendingApprovals} Proofs</p>
        </div>
        <div className="paysub-stat-card">
          <Coins size={26} className="icon-green" />
          <h3>Total Revenue</h3>
          <p>₱{summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="paysub-stat-card">
          <Star size={26} className="icon-blue" />
          <h3>Premium Enabled</h3>
          <p>{summary.premiumEmployers} Employers</p>
        </div>
      </div>

      {/* Monitor Subscriptions */}
      <h2 className="section-title"><ListFilter size={20} /> Monitor Employer Subscriptions</h2>
      <div className="paysub-table-container">
        <table className="paysub-table">
          <thead>
            <tr className="head-blue">
              <th>Employer</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td><strong>{sub.name}</strong></td>
                  <td>{sub.plan}</td>
                  <td>
                    <span className={`status-pill ${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>{sub.expiry}</td>
                  <td>
                    <button className={`btn-action ${sub.status === 'Active' ? 'btn-red' : 'btn-blue'}`}>
                      {sub.status === 'Active' ? 'Disable' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="empty-row">No active subscriptions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Proof Approval */}
      <h2 className="section-title"><FileText size={20} /> Approve Payment Proofs</h2>
      <div className="approval-section">
        {pendingProofs.length > 0 ? (
          pendingProofs.map((proof) => (
            <div key={proof.id} className="approval-card">
              <div className="proof-info">
                <h3><Users size={16} /> Employer: {proof.employer}</h3>
                <p><strong>Submitted On:</strong> {proof.date}</p>
                <p><strong>Plan:</strong> {proof.plan}</p>
                <div className="proof-action-row">
                  <button className="btn-view-proof"><Eye size={14} /> View Payment Proof</button>
                  <span className="file-name">{proof.fileName}</span>
                </div>
              </div>
              <div className="approval-btns">
                <button className="btn-approve"><CheckCircle2 size={16} /> Approve</button>
                <button className="btn-reject"><XCircle size={16} /> Reject</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-approval-state">
            <CheckCircle2 size={40} className="check-icon-dim" />
            <p>All clear! No pending payment proofs for approval.</p>
          </div>
        )}
      </div>

      {/* Billing History */}
      <h2 className="section-title"><Receipt size={20} /> Billing History</h2>
      <div className="paysub-table-container">
        <table className="paysub-table">
          <thead>
            <tr className="head-dark">
              <th>Employer</th>
              <th>Amount</th>
              <th>Plan</th>
              <th>Date Paid</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.length > 0 ? (
              billingHistory.map((history, i) => (
                <tr key={i}>
                  <td>{history.name}</td>
                  <td>₱{history.amount}</td>
                  <td>{history.plan}</td>
                  <td>{history.date}</td>
                  <td>{history.txnId}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="empty-row">No transaction history recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaySubManage;