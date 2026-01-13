// src/Pages/DepartmentDash/GageManagerPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  getManufacturers,
  getServiceProviders,
  getGages,
  getAllGageTypes,
} from "../../api/api";
import ManufacturerDetails from "./ManufacturerDetails";
import ServiceProviderDetails from "./ServiceProviderDetails";
import GageForm from "./GageForm";
import GageInventory from "./GageInventory";
import ManufacturerInventory from "./ManufacturerInventory";
import ServiceProviderInventory from "./ServiceProviderInventory";
import GageTypeForm from "./GageTypeForm";
import GageTypeInventory from "./GageTypeInventory";
import InhouseCalibrationMachineForm from "./InhouseCalibrationMachineForm";
import InhouseCalibrationMachineInventory from "./InhouseCalibrationMachineInventory";
import GageScanner from "../Layout/GageScanner";
import Modal from "../Modal";
import {
  Factory,
  Wrench,
  Ruler,
  Settings,
  Grid,
  Layers,
  Plus,
  FileText,
  BarChart3,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Shield,
} from "lucide-react";

const QRCodeSVG = ({ className = "w-6 h-6" }) => (
  <svg className={`${className} border border-gray-400 rounded`} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="7" height="7" fill="currentColor" />
    <rect x="2" y="23" width="7" height="7" fill="currentColor" />
    <rect x="23" y="2" width="7" height="7" fill="currentColor" />
    <rect x="23" y="23" width="7" height="7" fill="currentColor" />
    <rect x="13" y="13" width="3" height="3" fill="currentColor" />
    <rect x="10" y="4" width="2" height="2" fill="currentColor" />
    <rect x="17" y="4" width="2" height="2" fill="currentColor" />
    <rect x="14" y="8" width="2" height="2" fill="currentColor" />
    <rect x="10" y="12" width="2" height="2" fill="currentColor" />
    <rect x="17" y="12" width="2" height="2" fill="currentColor" />
    <rect x="14" y="16" width="2" height="2" fill="currentColor" />
    <rect x="10" y="20" width="2" height="2" fill="currentColor" />
    <rect x="17" y="20" width="2" height="2" fill="currentColor" />
    <rect x="14" y="24" width="2" height="2" fill="currentColor" />
    <rect x="10" y="28" width="2" height="2" fill="currentColor" />
    <rect x="17" y="28" width="2" height="2" fill="currentColor" />
  </svg>
);

const makeIcon = (Icon) => ({ className }) => <Icon className={className} />;

const GageManagerPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [gages, setGages] = useState([]);
  const [gageTypes, setGageTypes] = useState([]);
  const [inhouseCalibrationMachines, setInhouseCalibrationMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Real-time analytics derived from live data
  const analytics = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalGages = gages.filter(g => g.isActive !== false).length;
    const calibratedThisMonth = gages.filter(g => {
      if (!g.lastCalibrated) return false;
      const calDate = new Date(g.lastCalibrated);
      return calDate >= startOfMonth && calDate <= now;
    }).length;
    const dueForCalibration = gages.filter(g => {
      if (!g.nextCalibrationDue) return false;
      return new Date(g.nextCalibrationDue) <= now;
    }).length;
    const outOfTolerance = gages.filter(g => g.status === "OUT_OF_TOLERANCE").length;

    return {
      totalGages,
      calibratedThisMonth,
      dueForCalibration,
      outOfTolerance,
      activeManufacturers: manufacturers.length,
      certifiedProviders: serviceProviders.length,
    };
  }, [gages, manufacturers, serviceProviders]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [mfgs, sps, ggs, types] = await Promise.all([
          getManufacturers(),
          getServiceProviders(),
          getGages(),
          getAllGageTypes(),
        ]);

        setManufacturers(Array.isArray(mfgs) ? mfgs : []);
        setServiceProviders(Array.isArray(sps) ? sps : []);
        setGages(Array.isArray(ggs) ? ggs : []);
        setGageTypes(Array.isArray(types) ? types : []);

        const categories = [...new Set(ggs.filter(g => g.category).map(g => g.category))];
        // Gage categories removed - using gage sub-types now
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const closeModal = () => setActiveModal(null);

  const handleSave = (type, data) => {
    const newItem = { ...data, id: data.id || Date.now().toString() };
    switch (type) {
      case "manufacturer":
        setManufacturers((prev) => [...prev, newItem]);
        break;
      case "serviceProvider":
        setServiceProviders((prev) => [...prev, newItem]);
        break;
      case "gage":
        setGages((prev) => [...prev, newItem]);
        break;
      case "gageType":
        setGageTypes((prev) => [...prev, newItem]);
        break;
      case "inhouseCalibrationMachine":
        setInhouseCalibrationMachines((prev) => [...prev, newItem]);
        break;
      default:
        break;
    }
    closeModal();
  };

  // Analytics Cards Data (no static trends — focus on real values)
  const analyticsCards = [
    {
      title: "Total Gages",
      value: analytics.totalGages,
      icon: Ruler,
      color: "blue",
      description: "Active equipment in system"
    },
    {
      title: "Calibrated This Month",
      value: analytics.calibratedThisMonth,
      icon: CheckCircle2,
      color: "green",
      description: "On-time calibrations"
    },
    {
      title: "Due for Calibration",
      value: analytics.dueForCalibration,
      icon: Calendar,
      color: "orange",
      description: "Requiring attention"
    },
    {
      title: "Out of Tolerance",
      value: analytics.outOfTolerance,
      icon: AlertCircle,
      color: "red",
      description: "Needs immediate action"
    },
    {
      title: "Active Manufacturers",
      value: analytics.activeManufacturers,
      icon: Factory,
      color: "purple",
      description: "OEM partners"
    },
    {
      title: "Certified Providers",
      value: analytics.certifiedProviders,
      icon: Shield,
      color: "indigo",
      description: "Authorized service partners"
    }
  ];

  const inventoryItems = useMemo(() => [
    {
      key: "viewGage",
      label: "Gages",
      icon: makeIcon(Ruler),
      count: gages.length,
      description: "Active Equipment",
      color: "blue"
    },
    {
      key: "viewGageType",
      label: "Gage Types",
      icon: makeIcon(Grid),
      count: gageTypes.length,
      description: "Equipment Categories",
      color: "purple"
    },
    {
      key: "viewInhouseCalibrationMachine",
      label: "Inhouse Calibration Machines",
      icon: makeIcon(Settings),
      count: inhouseCalibrationMachines.length,
      description: "Calibration equipment",
      color: "indigo"
    },
    {
      key: "viewManufacturer",
      label: "Manufacturers",
      icon: makeIcon(Factory),
      count: manufacturers.length,
      description: "OEM Partners",
      color: "green"
    },
    {
      key: "viewServiceProvider",
      label: "Service Providers",
      icon: makeIcon(Wrench),
      count: serviceProviders.length,
      description: "Authorized Partners",
      color: "orange"
    },
    {
      key: "scanBarcode",
      label: "Scan Barcode",
      icon: QRCodeSVG,
      count: "",
      description: "Quick Gage Lookup",
      color: "gray"
    },
  ], [manufacturers, serviceProviders, gages, gageTypes, inhouseCalibrationMachines]);

  const addItems = [
    { key: "gage", title: "Add Gage", description: "Register new equipment", icon: Ruler, color: "blue" },
    { key: "gageType", title: "Add Gage Type", description: "Create equipment category", icon: Grid, color: "purple" },
    { key: "inhouseCalibrationMachine", title: "Add Inhouse Calibration Machine", description: "Register calibration machine", icon: Settings, color: "indigo" },
    { key: "manufacturer", title: "Add Manufacturer", description: "Register new OEM partner", icon: Factory, color: "green" },
    { key: "serviceProvider", title: "Add Service Provider", description: "Register service partner", icon: Wrench, color: "orange" },
  ];

  const getColorClasses = (color, type = "bg") => {
    const colors = {
      blue: { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
      green: { bg: "bg-green-500", light: "bg-green-100", text: "text-green-700", border: "border-green-200" },
      orange: { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
      red: { bg: "bg-red-500", light: "bg-red-100", text: "text-red-700", border: "border-red-200" },
      purple: { bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
      indigo: { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
      gray: { bg: "bg-gray-500", light: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  const renderAnalyticsCard = (card) => (
    <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${getColorClasses(card.color, "light")}`}>
          <card.icon className={`w-5 h-5 ${getColorClasses(card.color, "text")}`} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
      <p className="text-sm font-medium text-gray-700 mt-1">{card.title}</p>
      <p className="text-xs text-gray-500 mt-1">{card.description}</p>
    </div>
  );

  const renderInventoryItem = (item) => (
    <button
      key={item.key}
      onClick={() => setActiveModal(item.key)}
      className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all bg-white group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2.5 rounded-lg ${getColorClasses(item.color, "light")} group-hover:scale-105 transition-transform`}>
          <item.icon className={`w-5 h-5 ${getColorClasses(item.color, "text")}`} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-left">{item.label}</p>
          <p className="text-sm text-gray-600 text-left">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {item.count !== "" ? (
          <span className={`text-sm font-semibold ${getColorClasses(item.color, "text")} bg-white px-2.5 py-1 rounded-lg border ${getColorClasses(item.color, "border")}`}>
            {item.count}
          </span>
        ) : (
          <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-300">
            Scan
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading Gage Management System...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* CENTERED HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gage Management System</h1>
          <p className="text-gray-600">Comprehensive equipment tracking and calibration management</p>
        </div>

        {/* ANALYTICS GRID - SMALL & CLEAN */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {analyticsCards.map(renderAnalyticsCard)}
        </div>

        {/* ADD NEW ITEMS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {addItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveModal(item.key)}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-solid hover:shadow hover:scale-[1.02] transition-all bg-white"
              >
                <div className={`p-2 rounded-lg ${getColorClasses(item.color, "light")} mb-2`}>
                  <item.icon className={`w-5 h-5 ${getColorClasses(item.color, "text")}`} />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INVENTORY OVERVIEW */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Inventory Overview</h2>
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            {inventoryItems.map(renderInventoryItem)}
          </div>
        </div>

        {/* MODALS */}
        {activeModal === "manufacturer" && (
          <Modal title="Add Manufacturer" onClose={closeModal}>
            <ManufacturerDetails onClose={closeModal} onSave={(data) => handleSave("manufacturer", data)} />
          </Modal>
        )}
        {activeModal === "serviceProvider" && (
          <Modal title="Add Service Provider" onClose={closeModal}>
            <ServiceProviderDetails onClose={closeModal} onSave={(data) => handleSave("serviceProvider", data)} />
          </Modal>
        )}
        {activeModal === "gage" && (
          <Modal title="Add Gage" onClose={closeModal}>
            <GageForm onClose={closeModal} onSave={(data) => handleSave("gage", data)} />
          </Modal>
        )}
        {activeModal === "gageType" && (
          <Modal title="Add Gage Type" onClose={closeModal}>
            <GageTypeForm onClose={closeModal} onSave={(data) => handleSave("gageType", data)} />
          </Modal>
        )}
        {activeModal === "inhouseCalibrationMachine" && (
          <Modal title="Calibration Machine / Instrument Details" onClose={closeModal}>
            <InhouseCalibrationMachineForm onClose={closeModal} onSave={(data) => handleSave("inhouseCalibrationMachine", data)} />
          </Modal>
        )}
        {activeModal === "viewManufacturer" && <ManufacturerInventory isOpen={true} onClose={closeModal} />}
        {activeModal === "viewServiceProvider" && <ServiceProviderInventory isOpen={true} onClose={closeModal} />}
        {activeModal === "viewGage" && <GageInventory isOpen={true} onClose={closeModal} />}
        {activeModal === "viewGageType" && <GageTypeInventory isOpen={true} onClose={closeModal} />}
        {activeModal === "viewInhouseCalibrationMachine" && <InhouseCalibrationMachineInventory isOpen={true} onClose={closeModal} />}
        {activeModal === "scanBarcode" && <GageScanner onClose={closeModal} onScanResult={() => {}} />}
      </div>
    </div>
  );
};

export default GageManagerPage;