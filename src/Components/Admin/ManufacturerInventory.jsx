import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Factory, LayoutGrid, Table2 } from "lucide-react";
import EditManufacturerForm from "./EditManufacturerForm";
import ManufacturerTableView from "./ManufacturerTableView";
import { ManufacturerCardView } from "./ManufacturerCardView";
import AddManufacturer from "./ManufacturerDetails";

const ManufacturerInventory = () => {
  const [activeModal, setActiveModal] = useState("inventory"); // start directly in inventory
  const [manufacturers, setManufacturers] = useState([]);
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [countryData, setCountryData] = useState([]);

  // Load countries once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        const data = await res.json();

        const formatted = data
          .map((c) => {
            const dial =
              c.idd?.root && c.idd?.suffixes?.length
                ? c.idd.root + c.idd.suffixes[0]
                : "";
            return {
              name: c.name?.common || "",
              dial_code: dial,
              flag: c.cca2
                ? `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`
                : "",
              code: c.cca2 || "",
            };
          })
          .filter((c) => c.name && c.dial_code && c.code)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountryData(formatted);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch manufacturers when inventory modal opens
  useEffect(() => {
    if (activeModal === "inventory") {
      fetchManufacturers();
    }
  }, [activeModal]);

  const fetchManufacturers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/manufacturers");
      setManufacturers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch manufacturers.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (id) => {
    try {
      const res = await axios.get(`/manufacturers/${id}`);
      setEditingManufacturer(res.data);
      setActiveModal("edit");
    } catch (err) {
      console.error("Failed to fetch manufacturer by ID", err);
      alert("Error loading manufacturer details.");
    }
  };

  const handleRetire = async (id, name) => {
    if (!window.confirm(`Are you sure you want to retire "${name}"?`)) return;

    try {
      await axios.put(`/manufacturers/${id}/retire`);
      setManufacturers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "RETIRED" } : m))
      );
      alert(`"${name}" has been retired.`);
    } catch (err) {
      console.error("Error retiring manufacturer:", err);
      alert("Failed to retire manufacturer.");
    }
  };

  const closeModal = () => {
    if (activeModal === "edit" || activeModal === "add") {
      setActiveModal("inventory"); // go back to inventory
    } else {
      setActiveModal(null); // fully close
    }
    setEditingManufacturer(null);
  };

  const handleUpdatedManufacturer = (updated) => {
    setManufacturers((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    closeModal();
  };

  const handleAddManufacturerClick = () => {
    setEditingManufacturer(null);
    setActiveModal("add");
  };

  const handleAddSave = (newManufacturer) => {
    setManufacturers((prev) => [...prev, newManufacturer]);
    closeModal();
  };

  return (
    <>
      {/* Inventory Modal */}
      {activeModal === "inventory" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-7xl max-h-[90vh] overflow-auto p-6 rounded-lg shadow-xl relative">
            <button
              onClick={closeModal}
              aria-label="Close Inventory"
              className="absolute top-1 right-1 text-gray-600 hover:text-gray-900 font-bold text-2xl"
            >
              &times;
            </button>

            {/* Header */}
            <div className="bg-[#005797] border border-[#004377] rounded-md p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3 text-white">
                <Factory className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-semibold">
                  View Manufacturer Details
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={handleAddManufacturerClick}
                  className="px-4 py-1 mt-2 bg-green-500 hover:bg-green-600 text-white rounded transition duration-200"
                >
                  + Add Manufacturer
                </button>

                <button
                  title="Table View"
                  className={`p-2 rounded-md border ${
                    viewMode === "table"
                      ? "bg-white text-[#005797] border-white"
                      : "bg-[#004377] text-white hover:bg-[#00325c]"
                  } transition duration-200`}
                  onClick={() => setViewMode("table")}
                >
                  <Table2 className="h-5 w-5" />
                </button>

                <button
                  title="Card View"
                  className={`p-2 rounded-md border ${
                    viewMode === "card"
                      ? "bg-white text-[#005797] border-white"
                      : "bg-[#004377] text-white hover:bg-[#00325c]"
                  } transition duration-200`}
                  onClick={() => setViewMode("card")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading && <p>Loading manufacturers...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
              <>
                {viewMode === "table" ? (
                  <ManufacturerTableView
                    data={manufacturers}
                    onEdit={(m) => openEditModal(m.id)}
                    onRetire={handleRetire}
                    onSchedule={(m) =>
                      alert(`Schedule clicked for: ${m.name}`)
                    }
                    onUpdated={handleUpdatedManufacturer}
                  />
                ) : (
                  <ManufacturerCardView
                    data={manufacturers}
                    onUpdated={handleUpdatedManufacturer}
                    onEdit={(m) => openEditModal(m.id)}
                    onRetire={handleRetire}
                    onSchedule={(m) =>
                      alert(`Schedule clicked for: ${m.name}`)
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {activeModal === "edit" && editingManufacturer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="relative bg-white p-6 max-w-5xl w-full rounded shadow-xl mt-10 mb-10 max-h-screen overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close Edit"
            >
              &times;
            </button>

            <EditManufacturerForm
              defaultValues={editingManufacturer}
              onClose={closeModal}
              countryData={countryData}
              onUpdate={handleUpdatedManufacturer}
            />
          </div>
        </div>
      )}

      {/* Add Modal */}
      {activeModal === "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="relative bg-white p-6 max-w-3xl w-full rounded shadow-xl mt-10 mb-10 max-h-screen overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close Add"
            >
              &times;
            </button>

            <AddManufacturer
              isOpen={true}
              countryData={countryData}
              onClose={closeModal}
              onSave={handleAddSave}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ManufacturerInventory;
