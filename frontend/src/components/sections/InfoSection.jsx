import React from 'react';

const InfoSection = () => (
  <main className="container">
    <section id="how">
      <h2 className="section-title">How it works</h2>
      <div className="steps">
        <div className="card"><strong>1. Create your profile</strong><p className="muted">Add your course and strengths.</p></div>
        <div className="card"><strong>2. Get suggestions</strong><p className="muted">Roles aligned to your profile.</p></div>
        <div className="card"><strong>3. Check requirements</strong><p className="muted">Know if experience is needed.</p></div>
        <div className="card"><strong>4. Apply</strong><p className="muted">Track applications easily.</p></div>
      </div>
    </section>

    <section id="contact">
      <h2 className="section-title">Contact</h2>
      <div className="grid">
        <div className="card"><strong>Email</strong><p className="muted">hello@Intjobs.app</p></div>
        <div className="card"><strong>Partners</strong><p className="muted">tcc.ccs.official@gmail.com</p></div>
        <div className="card"><strong>Employers</strong><p className="muted">talent@Intjobs.app</p></div>
      </div>
    </section>
  </main>
);

export default InfoSection;