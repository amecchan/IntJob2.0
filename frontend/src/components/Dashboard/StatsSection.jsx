import React from 'react';
import StatCard from '../Cards/StatCard';
import { FileTextIcon, PersonIcon, ClockIcon } from '@radix-ui/react-icons';
import "../../styles/StatCard.css";

const StatsSection = () => {
  const stats = [
    { label: 'Total Job Posts', value: '5', trend: '+1 this month', icon: <FileTextIcon />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Applicants', value: '34', trend: '+12% from last week', icon: <PersonIcon />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Reviews', value: '7', trend: 'Needs attention', icon: <ClockIcon />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
};

export default StatsSection;