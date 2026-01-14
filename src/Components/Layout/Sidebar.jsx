// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  // LayoutDashboard, // Removed - replacing with Home for dashboard
  Home, // ✅ Added Home icon for dashboard
  Building2,
  Workflow,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  LogOut,
  Ruler,
  Bell,
  MessageCircle,
  User,
  QrCode,
  X,
  User2Icon,
} from "lucide-react";

// ✅ IMPORTS YOU REQUESTED
import GageScanner from '../Layout/GageScanner';
import ProfileModal from "./Profile";
import ReallocationManagementModal from '../../Components/ReallocationManagementModal';
import { getReallocatesByStatus } from '../../api/api';
import api from "../../api/axios";

export default function Sidebar({
  isSidebarOpen,
  setSidebarOpen,
}) {
  const { user, loading, hasRole, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    departments: false,
    functions: false,
    operations: false,
    admin: false,
    calibration: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMorning, setIsMorning] = useState(true);
  const [showReallocFeature, setShowReallocFeature] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ MODAL/DRAWER STATES
  const [showScanner, setShowScanner] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReallocModal, setShowReallocModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ profileImage: "" });

  const username = user?.username || user?.name || user?.email || "User";

  // Fetch reallocation count
  const fetchNotificationCount = async () => {
    if (!showReallocFeature) return;
    try {
      const pending = await getReallocatesByStatus('PENDING_APPROVAL');
      setNotificationCount(pending.length || 0);
    } catch (err) {
      console.error('Error fetching realloc count:', err);
      setNotificationCount(0);
    }
  };

  // Determine reallocation access
  useEffect(() => {
    if (user) {
      const role = (user.role?.toString() || "").toLowerCase();
      const show = role.includes("hod") || role.includes("plant_hod") || role.includes("planthod");
      setShowReallocFeature(show);
    }
  }, [user]);

  // Fetch notifications if eligible
  useEffect(() => {
    if (showReallocFeature) {
      fetchNotificationCount();
    } else {
      setNotificationCount(0);
    }
  }, [showReallocFeature]);

  // Time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setIsMorning(now.getHours() >= 6 && now.getHours() < 18);
    };
    updateTime();
    const id = setInterval(updateTime, 60000);
    return () => clearInterval(id);
  }, []);

  // Update user info for avatar
  useEffect(() => {
    if (user) {
      setUserInfo({
        profileImage: user.profileImage || user.avatar || "",
      });
    }
  }, [user]);

  if (loading || !user) return null;

  const isAdmin = hasRole("ADMIN");
  const isItAdmin = hasRole("IT_ADMIN") || hasRole("IT ADMIN");
  const isCalibrationManager = user.role === "CALIBRATION_MANAGER";

  const functionsToShow = ["INVENTORY_MANAGER"].includes(user.role)
    ? ["f1", "f2", "f3"]
    : user.functions?.map(f => f?.name).filter(Boolean) || [];

  const operationsToShow = ["INVENTORY_MANAGER"].includes(user.role)
    ? ["ot1", "ot2", "ot3"]
    : user.operations?.map(op => op?.name).filter(Boolean) || [];

  const departmentsToShow = ["INVENTORY_MANAGER"].includes(user.role)
    ? ["f1", "f2", "store"]
    : user.departments?.map(d => d?.name).filter(Boolean) || [];

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      authLogout?.();
      navigate("/login");
    }
  };

  const closeAll = () => setSidebarOpen(false);

  const handleQRScanClick = () => {
    setShowScanner(true);
    closeAll();
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    closeAll();
  };


  const handleNotificationsClick = () => {
    if (showReallocFeature) {
      setShowReallocModal(true);
      closeAll();
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 
                   bg-[#005797] border-r border-[#004a80] shadow-lg rounded-r-xl
                   transform transition-transform duration-300 z-50
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-60"}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-6">
            <div className="text-center mb-3">
              <div className="text-white text-lg font-medium">
                {formatDate(currentTime)}
              </div>
            </div>
            <div className="flex space-x-1">
              <button className={`flex-1 py-2 px-4 font-medium rounded-lg text-sm shadow transition-all ${isMorning ? "bg-white text-[#005797]" : "bg-[#004a80] text-white/70"}`}>
                MORNING
              </button>
              <button className={`flex-1 py-2 px-4 font-medium rounded-lg text-sm transition-all ${!isMorning ? "bg-white text-[#005797] shadow" : "bg-[#004a80] text-white/70"}`}>
                NIGHT
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1">
            {isCalibrationManager && user?.role && (
              <>
                {/* Common Dashboard */}
                <NavLink
                  to={
                    user.role === "IT_ADMIN"
                      ? "/dashboard/it-admin"
                      : `/dashboard/${user.role.toLowerCase()}`
                  }
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-[#004a80] text-white shadow-md"
                      : "text-white hover:text-white hover:bg-[#004a80]"
                    }`
                  }
                >
                  <Home size={16} />
                  Dashboard
                </NavLink>

                {/* IT Admin specific menu */}
                {/* ( */}
                <NavLink
                  to="/dashboard/it-admin"
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-[#004a80] text-white shadow-md"
                      : "text-white hover:text-white hover:bg-[#004a80]"
                    }`
                  }
                >
                  <User2Icon size={16} />
                  User Management
                </NavLink>
                {/* )} */}
              </>
            )}


            {(isAdmin || isItAdmin || isCalibrationManager) && (
              <div className="mt-3">

                {
                  !isItAdmin && (
                    <button
                      onClick={() => toggleSection("admin")}
                      className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-white hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Shield size={16} />
                        Inverntory Management
                      </span>
                      {openSections.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )
                }




                {openSections.admin && (
                  <div className="mt-1 space-y-1">
                    {isItAdmin || isCalibrationManager && (
                      <>
                        <NavLink to="/it-admin/users" onClick={closeAll} className={({ isActive }) => `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                          <Users size={16} /> Users
                        </NavLink>
                        <NavLink to="/it-admin/departments" onClick={closeAll} className={({ isActive }) => `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                          <Building2 size={16} /> Departments
                        </NavLink>
                        <NavLink to="/it-admin/functions" onClick={closeAll} className={({ isActive }) => `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                          <Workflow size={16} /> Functions
                        </NavLink>
                        <NavLink to="/it-admin/operations" onClick={closeAll} className={({ isActive }) => `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                          <Settings size={16} /> Operations
                        </NavLink>
                        <NavLink to="/it-admin/roles" onClick={closeAll} className={({ isActive }) => `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                          <Shield size={16} /> Roles
                        </NavLink>
                      </>
                    )}
                  </div>
                )}

                {isItAdmin && (
                  <div className="mt-2 mb-2 space-y-2">
                    <NavLink
                      to="/dashboard"
                      onClick={closeAll}
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"
                        }`
                      }
                    >
                      <Shield size={16} />Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/calibration"
                      onClick={closeAll}
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"
                        }`
                      }
                    >
                      <Ruler size={16} /> Calibration Manager
                    </NavLink>
                    <NavLink
                      to="/dashboard/admin"
                      onClick={closeAll}
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"
                        }`
                      }
                    >
                      <Shield size={16} /> Admin Dashboard
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {isCalibrationManager && (
              <div className="mt-3">
                <button
                  onClick={() => toggleSection("calibration")}
                  className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-white hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Ruler size={16} />
                    Calibration
                  </span>
                  {openSections.calibration ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.calibration && (
                  <div className="mt-1 space-y-1">
                    <NavLink
                      to="/admin/calibration"
                      onClick={closeAll}
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-6 rounded text-sm transition-all ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"
                        }`
                      }
                    >
                      <Ruler size={16} /> Calibration Management
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {!isCalibrationManager && departmentsToShow.length > 0 && (
              <div className="mt-3">
                <button onClick={() => toggleSection("departments")} className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-white hover:text-white transition-colors">
                  <span className="flex items-center gap-2"><Building2 size={16} /> DEPARTMENTS</span>
                  {openSections.departments ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.departments && (
                  <div className="mt-1 space-y-1">
                    {departmentsToShow.map(d => (
                      <NavLink key={d} to={`/departments/${d}`} onClick={closeAll} className={({ isActive }) => `block py-2 px-6 rounded-lg text-sm font-medium transition-all capitalize ${isActive ? "bg-[#004a80] text-white shadow-md" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                        {d}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isCalibrationManager && functionsToShow.length > 0 && (
              <div className="mt-3">
                <button onClick={() => toggleSection("functions")} className="flex items-center justify-between w-full py-2 px-3 text-xs font-medium text-white hover:text-white transition-colors">
                  <span className="flex items-center gap-2"><Workflow size={16} /> FUNCTIONS</span>
                  {openSections.functions ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.functions && (
                  <div className="mt-1 space-y-1">
                    {functionsToShow.map(f => (
                      <NavLink key={f} to={`/functions/${f}`} onClick={closeAll} className={({ isActive }) => `block py-2 px-6 rounded text-sm transition-all uppercase ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                        {f}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isCalibrationManager && operationsToShow.length > 0 && (
              <div className="mt-3">
                <button onClick={() => toggleSection("operations")} className="flex items-center justify-between w-full py-2 px-3 text-xs font-medium text-white hover:text-white transition-colors">
                  <span className="flex items-center gap-2"><Settings size={16} /> OPERATIONS</span>
                  {openSections.operations ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.operations && (
                  <div className="mt-1 space-y-1">
                    {operationsToShow.map(op => (
                      <NavLink key={op} to={`/operations/${op}`} onClick={closeAll} className={({ isActive }) => `block py-2 px-6 rounded text-sm transition-all uppercase ${isActive ? "bg-[#004a80] text-white" : "text-white hover:text-white hover:bg-[#004a80]"}`}>
                        {op}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ✅ ACCOUNT SECTION WITH QR SCAN */}
          <div className="pt-4 mt-4 border-t border-[#004a80]">
            <div className="mb-3 text-xs font-semibold text-white opacity-80">ACCOUNT</div>



            <button onClick={handleQRScanClick} className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-all text-white hover:bg-[#004a80] cursor-pointer">
              <div className="flex items-center gap-2">
                <QrCode size={16} />
                Scan QR Code
              </div>
            </button>

            <button
              onClick={handleNotificationsClick}
              disabled={!showReallocFeature}
              className={`flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-all ${showReallocFeature ? "text-white hover:bg-[#004a80] cursor-pointer" : "text-white/60 cursor-not-allowed"
                }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </div>
              {showReallocFeature && notificationCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold">
                  {notificationCount}
                </span>
              )}
            </button>


            <button onClick={handleProfileClick} className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-all text-white hover:bg-[#004a80] cursor-pointer">
              <div className="flex items-center gap-2">
                <User size={16} />
                Profile
              </div>
            </button>
          </div>


        </div>
      </aside>

      {/* ✅ QR SCANNER MODAL */}
      {showScanner && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowScanner(false)}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-3 right-3 z-10 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition"
                aria-label="Close scanner"
              >
                <X size={24} />
              </button>
              <div className="p-1">
                <GageScanner onClose={() => setShowScanner(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ PROFILE MODAL */}
      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUpdated={(newImage) => setUserInfo(prev => ({ ...prev, profileImage: newImage }))}
      />


      {/* ✅ REALLOCATION MODAL */}
      {showReallocFeature && (
        <ReallocationManagementModal
          isOpen={showReallocModal}
          onClose={() => setShowReallocModal(false)}
          onRefresh={fetchNotificationCount}
        />
      )}
    </>
  );
}