// src/components/PlantHeadDash.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Users,
  Building,
  Settings,
  Wrench
} from 'lucide-react';

const DashboardCard = ({ title, description, to, icon: Icon, colorClass }) => {
  return (
    <Link to={to} className="block no-underline h-full group">
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-gray-100 transition-all duration-300 
                      hover:shadow-xl hover:-translate-y-1.5 hover:border-transparent
                      hover:ring-2 hover:ring-offset-2 hover:ring-opacity-40"
           style={{ 
             boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
             transitionProperty: 'all',
           }}>
        {/* Icon Circle - Enhanced */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${colorClass.bg}`}>
          <Icon className={`w-7 h-7 ${colorClass.text}`} strokeWidth={2} />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-grow">
          {description}
        </p>

        {/* Subtle arrow hint on hover (optional) */}
        <span className="mt-3 inline-flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Go to module
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

const PlantHeadDash = () => {
  const cards = [
    {
      title: 'Calibration Manager',
      description: 'Monitor and manage calibration workflows across departments.',
      to: '/admin/calibration',
      icon: ClipboardCheck,
      colorClass: { bg: 'bg-blue-50', text: 'text-blue-600' },
    },
    {
      title: 'Users',
      description: 'Manage user accounts, roles, and access permissions securely.',
      to: '/it-admin/users',
      icon: Users,
      colorClass: { bg: 'bg-purple-50', text: 'text-purple-600' },
    },
    {
      title: 'Departments',
      description: 'Organize and maintain company department structure.',
      to: '/it-admin/departments',
      icon: Building,
      colorClass: { bg: 'bg-green-50', text: 'text-green-600' },
    },
    {
      title: 'Functions',
      description: 'Define job functions, responsibilities, and reporting lines.',
      to: '/it-admin/functions',
      icon: Settings,
      colorClass: { bg: 'bg-amber-50', text: 'text-amber-600' },
    },
    {
      title: 'Calibration Admin',
      description: 'Configure instruments, schedules, and compliance rules.',
      to: '/admin/calibration',
      icon: Wrench,
      colorClass: { bg: 'bg-rose-50', text: 'text-rose-600' },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Plant Head Dashboard
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Access all modules in one place — monitor, manage, and optimize operations efficiently.
          </p>
          <div className="w-24 h-1 bg-blue-500 rounded-full mx-auto mt-6"></div>
        </header>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              to={card.to}
              icon={card.icon}
              colorClass={card.colorClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantHeadDash;