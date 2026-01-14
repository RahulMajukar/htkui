import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import GageTypeForm from "./GageTypeForm";
import api from "../../api/axios";
import { MaterialReactTable } from "material-react-table";
import { Edit, Download, Upload, Plus } from "lucide-react";

export default function GageTypeInventory({ isOpen, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [gageTypes, setGageTypes] = useState([]);
  const [gageSubTypes, setGageSubTypes] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const fetchGageTypes = async () => {
    try {
      const res = await api.get("/gage-types/all");
      setGageTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching gage types:", err);
    }
  };

  const fetchGageSubTypes = async () => {
    try {
      const res = await api.get("/gage-sub-types/all");
      setGageSubTypes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch gage sub types", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGageTypes();
      fetchGageSubTypes();
    }
  }, [isOpen]);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await api.put(`/gage-types/${data.id}`, data);
        alert("✅ Gage Type updated successfully!");
      } else {
        await api.post("/gage-types/add", data);
        alert("✅ Gage Type added successfully!");
      }

      await fetchGageTypes();
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save gage type");
    }
  };

  const handleEdit = (rowData) => {
    setEditData(rowData);
    setShowForm(true);
  };

  const getSubTypeName = (subTypeId) => {
    if (!subTypeId) return "-";
    const subType = gageSubTypes.find(st => st.id === subTypeId);
    return subType ? subType.name : "-";
  };

  // Helper function to get or create sub-type
  const getOrCreateSubType = async (subTypeName) => {
    if (!subTypeName || subTypeName.trim() === "") {
      return null;
    }

    const trimmedName = subTypeName.trim();
    
    // Check if sub-type already exists in local state
    const existingSubType = gageSubTypes.find(
      st => st.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingSubType) {
      return existingSubType.id;
    }

    try {
      // Create new sub-type
      console.log(`Creating new sub-type: ${trimmedName}`);
      const createRes = await api.post("/gage-sub-types/add", {
        name: trimmedName,
      });
      
      // Add to local state
      const newSubType = createRes.data;
      setGageSubTypes(prev => [...prev, newSubType]);
      
      return newSubType.id;
    } catch (error) {
      console.error(`Failed to create sub-type: ${trimmedName}`, error);
      // If creation fails, return null (no sub-type)
      return null;
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Description", "Gage Sub-Type"];
    const csvData = gageTypes.map(item => [
      item.name || "",
      item.description || "",
      getSubTypeName(item.gageSubTypeId) || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gage-types-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert("✅ Gage types exported successfully!");
  };

  const exportTemplate = () => {
    const headers = ["Name", "Description", "Gage Sub-Type"];
    const exampleRow = ["Example Gage", "This is an example description", "Sub-Type A"];
    const noteRow = "New sub-types will be created automatically if they don't exist";
    
    const csvContent = [
      headers.join(","),
      exampleRow.map(cell => `"${cell}"`).join(","),
      `"${noteRow}"`
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gage-types-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      
      // Parse CSV with proper quote handling
      const parseCSVLine = (line) => {
        const result = [];
        let inQuotes = false;
        let currentField = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(currentField.trim().replace(/^"|"$/g, ''));
            currentField = '';
          } else {
            currentField += char;
          }
        }
        
        result.push(currentField.trim().replace(/^"|"$/g, ''));
        return result;
      };
      
      const headers = parseCSVLine(lines[0]);
      
      const previewData = lines.slice(1, 6).map(line => {
        const values = parseCSVLine(line);
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        return row;
      });
      
      setImportPreview(previewData);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importFile) {
      alert("❌ Please select a file to import");
      return;
    }

    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          alert("❌ CSV file is empty");
          setIsImporting(false);
          return;
        }

        // Parse CSV with proper quote handling
        const parseCSVLine = (line) => {
          const result = [];
          let inQuotes = false;
          let currentField = '';
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(currentField.trim().replace(/^"|"$/g, ''));
              currentField = '';
            } else {
              currentField += char;
            }
          }
          
          result.push(currentField.trim().replace(/^"|"$/g, ''));
          return result;
        };
        
        const headers = parseCSVLine(lines[0]);
        
        // Find column indices
        const nameIndex = headers.findIndex(h => 
          h.toLowerCase().includes('name')
        );
        const descIndex = headers.findIndex(h => 
          h.toLowerCase().includes('desc')
        );
        const subTypeIndex = headers.findIndex(h => 
          h.toLowerCase().includes('sub') || h.toLowerCase().includes('type')
        );

        if (nameIndex === -1) {
          alert("❌ CSV must have a 'Name' column");
          setIsImporting(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const createdSubTypes = [];
        
        // Process each row
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);
            const name = values[nameIndex]?.trim();
            
            if (!name) {
              console.warn(`Row ${i}: Skipping - No name provided`);
              continue;
            }

            const description = descIndex >= 0 ? values[descIndex]?.trim() || "" : "";
            const subTypeName = subTypeIndex >= 0 ? values[subTypeIndex]?.trim() : "";
            
            let subTypeId = null;
            if (subTypeName) {
              subTypeId = await getOrCreateSubType(subTypeName);
              if (subTypeId && !createdSubTypes.includes(subTypeName)) {
                createdSubTypes.push(subTypeName);
              }
            }

            const item = {
              name,
              description,
              gageSubTypeId: subTypeId
            };

            // Check if item already exists
            const existingItems = gageTypes.filter(gt => 
              gt.name.toLowerCase() === name.toLowerCase()
            );
            
            if (existingItems.length > 0) {
              // Update existing
              await api.put(`/gage-types/${existingItems[0].id}`, item);
              console.log(`Updated: ${name}`);
            } else {
              // Create new
              await api.post("/gage-types/add", item);
              console.log(`Created: ${name}`);
            }
            successCount++;
            
          } catch (err) {
            console.error(`Row ${i}: Failed to import`, err);
            errorCount++;
          }
        }
        
        // Refresh data
        await fetchGageTypes();
        await fetchGageSubTypes();
        
        // Show summary
        let message = `✅ Import completed!\n\nSuccess: ${successCount}\nFailed: ${errorCount}`;
        
        if (createdSubTypes.length > 0) {
          message += `\n\nNew sub-types created: ${createdSubTypes.join(", ")}`;
        }
        
        if (errorCount > 0) {
          message += "\n\nCheck console for error details.";
        }
        
        alert(message);
        
        setShowImportModal(false);
        setImportFile(null);
        setImportPreview([]);
      } catch (err) {
        console.error("Import error:", err);
        alert("❌ Failed to import gage types");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(importFile);
  };

  const CardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
      {gageTypes.map((gt) => (
        <div
          key={gt.id}
          className="p-4 border rounded-lg shadow bg-white flex justify-between items-start"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{gt.name}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {gt.description || "No description"}
            </p>
            {gt.gageSubTypeId && (
              <p className="text-blue-600 text-sm mt-2">
                <span className="font-medium">Sub-Type:</span> {getSubTypeName(gt.gageSubTypeId)}
              </p>
            )}
          </div>
          <button
            onClick={() => handleEdit(gt)}
            className="text-blue-600 hover:underline text-sm ml-4"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );

  const TableView = () => {
    const columns = [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }) => cell.getValue() || "-",
      },
      {
        id: "gageSubType",
        header: "Gage Sub-Type",
        Cell: ({ row }) => getSubTypeName(row.original.gageSubTypeId),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <Edit className="w-4 h-4 inline" /> Edit
          </button>
        ),
      },
    ];

    return (
      <div className="max-h-[60vh] overflow-y-auto">
        <MaterialReactTable columns={columns} data={gageTypes} />
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <Modal
          onClose={onClose}
          title="Gage Types Inventory"
          className="text-xl font-semibold p-4 w-full max-w-5xl"
        >
          <div className="flex w-full justify-between items-center mb-4 gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === "card"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setViewMode("card")}
              >
                Card View
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === "table"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setViewMode("table")}
              >
                Table View
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
                onClick={exportToCSV}
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded flex items-center gap-2 hover:bg-purple-600"
                onClick={exportTemplate}
              >
                <Download className="w-4 h-4" /> Export Template
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-2 hover:bg-orange-600"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="w-4 h-4" /> Import CSV
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 inline" /> Add
              </button>
            </div>
          </div>

          {viewMode === "card" ? <CardView /> : <TableView />}
        </Modal>
      )}

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          title={editData ? "Edit Gage Type" : "Add Gage Type"}
          className="max-h-[80vh] overflow-y-auto"
        >
          <div className="p-4">
            <GageTypeForm
              onSave={handleSave}
              onClose={() => {
                setShowForm(false);
                setEditData(null);
              }}
              defaultValues={editData || undefined}
            />
          </div>
        </Modal>
      )}

      {showImportModal && (
        <Modal
          isOpen={showImportModal}
          onClose={() => {
            setShowImportModal(false);
            setImportFile(null);
            setImportPreview([]);
          }}
          title="Import Gage Types"
          className="max-w-3xl"
        >
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                File should have columns: <strong>Name</strong> (required), <strong>Description</strong> (optional), <strong>Gage Sub-Type</strong> (optional - new sub-types will be created automatically)
              </p>
            </div>

            {importPreview.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Preview (first 5 rows):</h4>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(importPreview[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importPreview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, idx) => (
                            <td key={idx} className="px-3 py-2 text-sm">
                              {value || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={exportTemplate}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                disabled={isImporting}
              >
                Download Template
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={!importFile || isImporting}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import Data
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}