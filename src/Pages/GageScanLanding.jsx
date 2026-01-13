import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import Loader from "../Components/Loader";
import GageCardView from "../Components/Admin/GageCardView";

export default function GageScanLanding() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gage, setGage] = useState(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const serial = params.get("serial") || params.get("serialnumber") || params.get("sn");
  const idParam = params.get("id");

  useEffect(() => {
    // If not authenticated, send to login with redirect back to this URL
    if (!isAuthenticated()) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      localStorage.setItem("redirectTo", location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`, { replace: true });
      return;
    }

    const fetchGage = async () => {
      try {
        setLoading(true);
        setError("");
        let resp;
        if (serial) {
          resp = await api.get(`/gages/serial/${encodeURIComponent(serial)}`);
        } else if (idParam) {
          resp = await api.get(`/gages/${encodeURIComponent(idParam)}`);
        } else {
          setError("Missing scan parameters.");
          return;
        }
        setGage(resp.data);
      } catch (e) {
        setError(e.response?.data?.message || "Could not load gage.");
      } finally {
        setLoading(false);
      }
    };

    fetchGage();
  }, [isAuthenticated, location.pathname, location.search, navigate, serial, idParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <Loader message="Opening gage..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white border rounded p-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Scanned Gage</h1>
      <GageCardView
        gages={gage ? [gage] : []}
        onEdit={() => {}}
        onSchedule={() => {}}
        onRetire={() => {}}
        selectedGage={null}
        showSchedule={false}
        setShowSchedule={() => {}}
        setSelectedGage={() => {}}
        onUpdated={() => {}}
      />
    </div>
  );
}


