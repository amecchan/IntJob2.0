import React from 'react';
import Card from '../Cards/Card';

const contacts = [
  { title: 'Email', description: 'hello@Intjobs.app' },
  { title: 'Partners', description: 'partner@intjobs.app' },
  { title: 'Employers', description: 'talent@Intjobs.app' },
];

const Contact = () => {
  return (
    <section id="contact">
      <h2 className="section-title">Contact</h2>
      <div className="grid">
        {contacts.map((contact, index) => (
          <Card key={index} title={contact.title} description={contact.description} />
        ))}
      </div>
    </section>
  );
};

export default Contact;
