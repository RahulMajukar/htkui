import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Truck,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  Eye,
  CalendarPlus
} from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, color, percent, tag, trend, onOpen, onSchedule }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
      text: 'bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent',
      badge: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
      border: 'border-blue-600/20',
      glow: 'shadow-lg shadow-blue-200/50'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
      text: 'bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent',
      badge: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
      border: 'border-green-600/20',
      glow: 'shadow-lg shadow-green-200/50'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      iconBg: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
      text: 'bg-gradient-to-br from-red-600 to-red-800 bg-clip-text text-transparent',
      badge: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
      border: 'border-red-600/20',
      glow: 'shadow-lg shadow-red-200/50'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconBg: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
      text: 'bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-transparent',
      badge: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
      border: 'border-orange-600/20',
      glow: 'shadow-lg shadow-orange-200/50'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
      text: 'bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent',
      badge: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
      border: 'border-purple-600/20',
      glow: 'shadow-lg shadow-purple-200/50'
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 border ${classes.border} transition-all duration-300 
      ${isHovered ? `${classes.glow} scale-105 -translate-y-1` : 'shadow-md shadow-gray-200/50'}
      hover:shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className={`absolute inset-0 ${classes.bg} opacity-50 rounded-2xl`}></div>
      
      {/* Content wrapper */}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-extrabold ${classes.text}`}>{value}</p>
              {trend && (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{trend}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Icon container with enhanced gradient */}
          <div className={`${classes.iconBg} p-4 rounded-2xl shadow-lg transform transition-all duration-300 
            ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}>
            <Icon className="h-7 w-7 text-white drop-shadow" />
          </div>
        </div>

        {/* Enhanced badges */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
          {percent !== undefined && (
            <span className={`${classes.badge} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm`}>
              <CheckCircle className="h-3.5 w-3.5" />
              {percent}% Success
            </span>
          )}
          {tag && (
            <span className={`${classes.badge} px-3 py-1.5 rounded-full text-xs font-bold shadow-sm animate-pulse`}>
              {tag}
            </span>
          )}
        </div>

        {/* Enhanced progress bar */}
        {percent !== undefined && (
          <div className="mb-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${classes.iconBg} transition-all duration-1000 ease-out`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Enhanced button */}
        <button
          onClick={onOpen}
          className={`w-full ${classes.iconBg} text-white py-3 px-4 rounded-xl text-sm font-semibold 
          transition-all duration-300 flex items-center justify-center gap-2 shadow-lg 
          hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

const SummaryCards = ({ summaryData, allGages, openDrawer, handleScheduleForCalibration }) => {
  // Default data for demo purposes
  const defaultSummaryData = summaryData || {
    totalGages: 1250,
    calibratedOnTime: 1128,
    outForCalibration: 45,
    outOfCalibration: 23,
    dueNext15Days: 54,
    scheduledGages: 89
  };

  const findAndSchedule = (filterFn) => {
    if (!allGages) {
      alert('Feature requires gage data');
      return;
    }
    const gage = allGages.find(filterFn);
    if (gage) {
      handleScheduleForCalibration?.(gage);
    } else {
      alert('No matching gages available');
    }
  };

  const handleOpen = (type) => {
    if (openDrawer) {
      openDrawer(type);
    } else {
      console.log(`Opening ${type} drawer`);
    }
  };

  const cards = [
    {
      title: "Total Gages",
      value: defaultSummaryData.totalGages,
      icon: BarChart3,
      color: "blue",
      type: "total",
      trend: "+12"
    },
    {
      title: "Calibrated On Time",
      value: defaultSummaryData.calibratedOnTime,
      icon: CheckCircle,
      color: "green",
      percent: defaultSummaryData.totalGages
        ? Math.round((defaultSummaryData.calibratedOnTime / defaultSummaryData.totalGages) * 100)
        : 0,
      type: "onTime",
      trend: "+5"
    },
    {
      title: "Out for Calibration",
      value: defaultSummaryData.outForCalibration,
      icon: Truck,
      color: "indigo",
      type: "outFor"
    },
    {
      title: "Calibration Due",
      value: defaultSummaryData.outOfCalibration,
      icon: AlertTriangle,
      color: "red",
      tag: "Action Required",
      type: "outOf"
    },
    {
      title: "Due Next 15 Days",
      value: defaultSummaryData.dueNext15Days,
      icon: Clock,
      color: "orange",
      type: "dueNext15"
    },
    {
      title: "Scheduled Gages",
      value: defaultSummaryData.scheduledGages,
      icon: Calendar,
      color: "purple",
      tag: "Ready",
      type: "scheduled",
      trend: "+8"
    }
  ];

  return (
    <div className="py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calibration Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your gage calibration status</p>
      </div>

      {/* Cards Grid */}

      <div className="mt-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {defaultSummaryData.totalGages
                ? Math.round((defaultSummaryData.calibratedOnTime / defaultSummaryData.totalGages) * 100)
                : 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Overall Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {defaultSummaryData.totalGages - defaultSummaryData.outOfCalibration}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Gages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {defaultSummaryData.dueNext15Days + defaultSummaryData.outOfCalibration}
            </p>
            <p className="text-sm text-gray-600 mt-1">Needs Attention</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {defaultSummaryData.scheduledGages}
            </p>
            <p className="text-sm text-gray-600 mt-1">In Queue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            percent={card.percent}
            tag={card.tag}
            trend={card.trend}
            onOpen={() => handleOpen(card.type)}
            onSchedule={() => findAndSchedule(g => g.source === card.type)}
          />
        ))}
      </div>

      {/* Quick Stats Footer */}

    </div>
  );
};

export default SummaryCards;