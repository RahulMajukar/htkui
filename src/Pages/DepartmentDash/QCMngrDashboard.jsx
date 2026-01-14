// src/components/QCMngrDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, LayoutDashboard } from 'lucide-react';

const DashboardCard = ({ title, description, to, icon: Icon, colorClass }) => {
  return (
    <Link to={to} className="block no-underline h-full group">
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-gray-200 shadow-sm transition-all duration-300 
                      hover:shadow-lg hover:-translate-y-1 hover:border-blue-200">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass.bg}`}>
          <Icon className={`w-6 h-6 ${colorClass.text}`} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-grow">{description}</p>
        <span className="mt-3 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View details →
        </span>
      </div>
    </Link>
  );
};

const QCMngrDashboard = () => {
  const cards = [
    {
      title: 'Calibration Admin',
      description: 'Manage calibration instruments, schedules, and compliance records.',
      to: '/admin/calibration',
      icon: Wrench,
      colorClass: { bg: 'bg-blue-50', text: 'text-blue-600' },
    },
    {
      title: 'Admin Dashboard',
      description: 'Access system overview, analytics, and administrative controls.',
      to: '/dashboard/admin',
      icon: LayoutDashboard,
      colorClass: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">QC Manager Dashboard</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Quick access to quality control and administrative modules.
          </p>
          <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto mt-5"></div>
        </header>

        {/* Responsive Grid - 1 column on mobile, 2 on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

export default QCMngrDashboard;