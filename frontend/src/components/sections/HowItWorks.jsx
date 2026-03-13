import React from 'react';
import Card from '../Cards/Card';

const steps = [
  { title: '1. Create your profile', description: 'Add your course and strengths.' },
  { title: '2. Get suggestions', description: 'Roles aligned to your profile.' },
  { title: '3. Check requirements', description: 'Know if experience is needed.' },
  { title: '4. Apply', description: 'Track applications easily.' },
];

const HowItWorks = () => {
  return (
    <section id="how">
      <h2 className="section-title">How it works</h2>
      <div className="steps">
        {steps.map((step, index) => (
          <Card key={index} title={step.title} description={step.description} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
