import React, { useState, useEffect } from "react";
import {
  Tag, Archive, MapPin, Calendar, Clock, Info, Search,
  Eye, EyeOff, FileText, ShieldCheck, BarChart, Flame,
  BadgeCheck, ChevronLeft, ChevronRight, IdCard, Upload,
  CheckCircle, Download, X, Users, Camera, Edit, Image as ImageIcon,
  ChevronLeft as LeftIcon, ChevronRight as RightIcon,
  Video, Play, ArrowUpDown
} from "lucide-react";
import ScheduleCalibration from "./DaynamiScheduleCalibration";
import EditGage from "./EditGage";
// ✅ Helper to convert Uint8Array/byte[] → Base64 string (if needed)
function byteArrayToBase64(byteArray) {
  if (!byteArray) return null;
  let binary = "";
  const bytes = new Uint8Array(byteArray);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
const ITEMS_PER_PAGE = 6;
// ✅ Image Carousel Component
const ImageCarousel = ({ images, videos = [], onImageClick, onGalleryClick, onVideoPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaType, setMediaType] = useState('images'); // 'images' or 'videos'
  const allMedia = [...images.map(img => ({ type: 'image', data: img })), ...videos.map(vid => ({ type: 'video', data: vid }))];
  const nextMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allMedia.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allMedia.length - 1 : prevIndex - 1
    );
  };
  const goToMedia = (index) => {
    setCurrentIndex(index);
  };
  if (allMedia.length === 0) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded-md border border-gray-200">
        No Media Available
      </div>
    );
  }
  const currentMedia = allMedia[currentIndex];
  return (
    <div className="relative w-full h-40 bg-black rounded-md overflow-hidden group">
      {/* Main Media Display */}
      {currentMedia.type === 'image' ? (
        <img
          src={`data:image/jpeg;base64,${currentMedia.data}`}
          alt={`Gage image ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onImageClick(`data:image/jpeg;base64,${currentMedia.data}`)}
        />
      ) : (
        <div
          className="w-full h-full bg-gray-800 flex items-center justify-center cursor-pointer relative"
          onClick={() => onVideoPlay(currentMedia.data)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-black bg-opacity-60 rounded-full p-4">
              <Play className="text-white" size={24} fill="white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Video size={12} />
            Video
          </div>
        </div>
      )}
      {/* Navigation Arrows */}
      {allMedia.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevMedia();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <LeftIcon size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMedia();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <RightIcon size={16} />
          </button>
        </>
      )}
      {/* Media Counter */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {allMedia.length}
      </div>
      {/* Media Type Indicator */}
      <div className="absolute top-2 right-2 flex gap-1">
        {videos.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMediaType(mediaType === 'images' ? 'videos' : 'images');
              // Find first video/image index
              const newIndex = allMedia.findIndex(media =>
                mediaType === 'images' ? media.type === 'video' : media.type === 'image'
              );
              if (newIndex !== -1) setCurrentIndex(newIndex);
            }}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              mediaType === 'videos'
                ? 'bg-purple-600 text-white'
                : 'bg-black bg-opacity-60 text-white hover:bg-opacity-80'
            }`}
          >
            {mediaType === 'images' ? 'Videos' : 'Photos'}
          </button>
        )}
      </div>
      {/* Gallery Button */}
      {allMedia.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGalleryClick(images, videos);
          }}
          className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition-colors"
          title={`View all ${allMedia.length} media files`}
        >
          <ImageIcon size={14} />
        </button>
      )}
      {/* Preview Button for Images */}
      {currentMedia.type === 'image' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageClick(`data:image/jpeg;base64,${currentMedia.data}`);
          }}
          className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition-colors"
          title="Preview Full Image"
        >
          <Eye size={14} />
        </button>
      )}
      {/* Play Button for Videos */}
      {currentMedia.type === 'video' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVideoPlay(currentMedia.data);
          }}
          className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition-colors"
          title="Play Video"
        >
          <Play size={14} fill="white" />
        </button>
      )}
      {/* Dots Indicator */}
      {allMedia.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToMedia(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? (media.type === 'image' ? 'bg-white' : 'bg-purple-400')
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
// ✅ Video Player Component
const VideoPlayerModal = ({ videoBase64, onClose }) => {
  const videoUrl = `data:video/webm;base64,${videoBase64}`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
        >
          <X size={20} />
        </button>
       
        <div className="p-4 bg-gray-800">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[70vh] rounded"
          >
            Your browser does not support the video tag.
          </video>
        </div>
       
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Gage Video</h3>
            <a
              href={videoUrl}
              download="gage_video.webm"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Download Video
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
const GageCardView = ({
  gages = [],
  onEdit,
  onSchedule,
  onRetire,
  selectedGage,
  showSchedule,
  setShowSchedule,
  setSelectedGage,
  onUpdated,
  externalScanResult,
  onClearScan
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [showAllDetails, setShowAllDetails] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingGage, setEditingGage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [manualPreviewUrl, setManualPreviewUrl] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [previewImageGallery, setPreviewImageGallery] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [downloadedCards, setDownloadedCards] = useState({});
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  // Auto-filter when scan happens externally
  useEffect(() => {
    if (externalScanResult?.serialNumber) {
      setSearchTerm(externalScanResult.serialNumber);
      setCurrentPage(1);
    }
  }, [externalScanResult]);
  // Sort gages based on creation date or ID (assuming newer items have higher IDs or later dates)
  const sortedGages = [...gages].sort((a, b) => {
    // Try to use creation date first, then fall back to ID
    const dateA = a.createdDate || a.purchaseDate || a.id;
    const dateB = b.createdDate || b.purchaseDate || b.id;
   
    if (sortOrder === "newest") {
      return new Date(dateB) - new Date(dateA) || b.id - a.id;
    } else {
      return new Date(dateA) - new Date(dateB) || a.id - b.id;
    }
  });
  const toggleCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleDownload = (gage, imageBase64, type) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `${type}_${gage.serialNumber || gage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedCards((prev) => ({ ...prev, [`${gage.id}-${type}`]: true }));
    setTimeout(() => {
      setDownloadedCards((prev) => ({ ...prev, [`${gage.id}-${type}`]: false }));
    }, 2000);
  };
  const filteredGages = searchTerm.trim() === ""
    ? sortedGages
    : sortedGages.filter((gage) =>
        (gage.gageType?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gage.serialNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
  const totalPages = Math.ceil(filteredGages.length / ITEMS_PER_PAGE);
  const paginatedGages = filteredGages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
 
  return (
    <div className="space-y-6">
      {/* Search & Toggle & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by gage type or serial number..."
            className="border border-gray-300 rounded px-3 py-1 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              if (externalScanResult) onClearScan?.();
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-gray-500" size={16} />
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
         
          <button
            onClick={() => setShowAllDetails(prev => !prev)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 border rounded hover:bg-gray-200"
          >
            {showAllDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAllDetails ? "Hide All Details" : "Show All Details"}
          </button>
        </div>
      </div>
      {/* Card List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedGages.length === 0 && (
          <p className="col-span-full text-center text-gray-600">No matching gages found.</p>
        )}
        {paginatedGages.map((gage) => {
          const showDetails = showAllDetails || expandedCards[gage.id];
          // ✅ Handle multiple images
          const imageArray = Array.isArray(gage.gageImages) ? gage.gageImages : [];
         
          // ✅ Handle multiple videos
          const videoArray = Array.isArray(gage.gageVideos) ? gage.gageVideos : [];
          // ✅ Handle manual
          let manualUrl = null;
          if (gage.gageManual) {
            const base64Manual = typeof gage.gageManual === "string" ? gage.gageManual : byteArrayToBase64(gage.gageManual);
            if (base64Manual) {
              const byteCharacters = atob(base64Manual);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "application/pdf" });
              manualUrl = URL.createObjectURL(blob);
            }
          }
          // ✅ Handle barcode/qr
          const barcodeBase64 = typeof gage.barcodeImage === "string" ? gage.barcodeImage : null;
          const qrCodeBase64 = typeof gage.qrCodeImage === "string" ? gage.qrCodeImage : null;
          return (
            <div
              key={gage.id}
              className="p-4 border rounded-xl shadow-sm bg-white flex flex-col justify-between h-full"
            >
              {/* ✅ Enhanced Media Carousel with Videos */}
              <ImageCarousel
                images={imageArray}
                videos={videoArray}
                onImageClick={(imageUrl) => setPreviewImageUrl(imageUrl)}
                onGalleryClick={(images, videos) => setPreviewImageGallery({ images, videos })}
                onVideoPlay={(videoBase64) => setPreviewVideo(videoBase64)}
              />
              {/* Header */}
              <div className="bg-blue-50 p-3 rounded flex justify-between items-start mt-2">
                <div>
                  <h3 className="text-base font-bold text-blue-900 flex items-center">
                    <Tag className="mr-2 text-teal-600" size={18} />
                    {gage.gageType?.name || "Unknown Type"}
                  </h3>
                  <p className="text-xs text-gray-600 pl-6">
                    Serial No: {gage.serialNumber || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    gage.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : gage.status === "RETIRED"
                      ? "bg-gray-200 text-gray-700"
                      : gage.status === "DUE"
                      ? "bg-yellow-100 text-yellow-800"
                      : gage.status === "OVERDUE"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {gage.status || "UNKNOWN"}
                </span>
                <button
                  onClick={() => toggleCard(gage.id)}
                  className="flex items-center gap-1 text-xs bg-gray-100 border rounded px-2 py-1 hover:bg-gray-200"
                >
                  {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showDetails ? "Hide" : "Show"}
                </button>
              </div>
              {/* ✅ Media Count Badge */}
              {(imageArray.length > 0 || videoArray.length > 0) && (
                <div className="flex gap-2 mt-1 justify-center">
                  {imageArray.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      <ImageIcon size={12} />
                      {imageArray.length} photo{imageArray.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {videoArray.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      <Video size={12} />
                      {videoArray.length} video{videoArray.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
              {/* ✅ Codes Section */}
              {(barcodeBase64 || qrCodeBase64) && (
                <div className="flex flex-col items-center my-2 gap-3">
                  <div className="w-full flex flex-col sm:flex-row gap-2 justify-center">
                    {barcodeBase64 && (
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={`data:image/png;base64,${barcodeBase64}`}
                          alt={`Barcode for ${gage.serialNumber}`}
                          className="w-auto max-w-[150px] h-auto object-contain border rounded"
                        />
                        <button
                          onClick={() => handleDownload(gage, barcodeBase64, 'Barcode')}
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 text-xs font-medium"
                        >
                          {downloadedCards[`${gage.id}-Barcode`] ? (
                            <>✓ Done</>
                          ) : (
                            <>↓ DOWNLOAD</>
                          )}
                        </button>
                      </div>
                    )}
                    {qrCodeBase64 && (
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={`data:image/png;base64,${qrCodeBase64}`}
                          alt={`QR Code for ${gage.serialNumber}`}
                          className="w-auto max-w-[150px] h-auto object-contain border rounded"
                        />
                        <button
                          onClick={() => handleDownload(gage, qrCodeBase64, 'QRCode')}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-medium"
                        >
                          {downloadedCards[`${gage.id}-QRCode`] ? (
                            <>✓ Done</>
                          ) : (
                            <>↓ DOWNLOAD</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Details */}
              {showDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Field icon={BarChart} label="Sub Type" value={gage.gageSubType?.name || gage.gageSubType || "-"} color="text-purple-600" />
                  <Field icon={ShieldCheck} label="OEM (Manufacturer)" value={gage.manufacturerName} />
                  <Field icon={FileText} label="Model Number" value={gage.modelNumber} color="text-cyan-700" />
                  <Field icon={Archive} label="Measurement Range" value={gage.measurementRange} color="text-blue-500" />
                  <Field icon={CheckCircle} label="Accuracy / Resolution" value={gage.accuracy} color="text-purple-500" />
                  <Field icon={Calendar} label="Purchase Date" value={gage.purchaseDate} color="text-indigo-600" />
                  <Field icon={BadgeCheck} label="Calibration Interval (months)" value={gage.calibrationInterval} color="text-green-600" />
                  <Field icon={Clock} label="Usage Frequency" value={gage.usageFrequency} color="text-pink-500" />
                  <Field icon={Flame} label="Criticality" value={gage.criticality} color="text-red-500" />
                  <Field icon={MapPin} label="Location" value={gage.location} color="text-yellow-600" />
                  <Field
                    icon={Calendar}
                    label="Next Calibration Date"
                    value={gage.nextCalibrationDate}
                    color="text-blue-700"
                  />
                  <div className="flex flex-col gap-0.5 bg-gray-50 px-2 py-1.5 rounded">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-blue-500" />
                      <span className="text-xs font-semibold text-gray-700">Remaining Days</span>
                    </div>
                    <span className={`text-sm font-medium ml-5 ${
                      (gage.remainingDays || 0) <= 7 ? "text-red-600" :
                      (gage.remainingDays || 0) <= 30 ? "text-yellow-600" :
                      "text-green-600"
                    }`}>
                      {gage.remainingDays || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-gray-50 px-2 py-1.5 rounded">
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-orange-600" />
                      <span className="text-xs font-semibold text-gray-700">Max Usages</span>
                    </div>
                    <span className="text-sm font-medium ml-5 text-gray-800">
                      {gage.currentUsers !== undefined
                        ? `${gage.currentUsers} / ${gage.maxUsersNumber || "-"}`
                        : gage.maxUsersNumber || "-"}
                    </span>
                  </div>
                  <Field
                    icon={Upload}
                    label="Gage Manual"
                    value={
                      manualUrl ? (
                        <div className="flex gap-6">
                          <button
                            onClick={() => setManualPreviewUrl(manualUrl)}
                            className="relative group"
                          >
                            <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                          </button>
                          <a
                            href={manualUrl}
                            download={`GageManual_${gage.serialNumber || gage.id}.pdf`}
                            className="relative group"
                          >
                            <Download className="w-5 h-5 text-green-600 hover:text-green-800 cursor-pointer" />
                          </a>
                        </div>
                      ) : (
                        "Not Provided"
                      )
                    }
                  />
                  <div className="flex flex-col gap-0.5 bg-purple-50 p-1.5 rounded mt-1 col-span-2">
                    <div className="flex items-center gap-1">
                      <Info className="text-purple-700" size={14} />
                      <span className="text-xs font-semibold text-gray-700">Notes</span>
                    </div>
                    <div className="ml-5 flex items-center justify-between">
                      {gage.notes ? (
                        <>
                          <p className="text-gray-800 text-sm whitespace-pre-wrap line-clamp-2 flex-1">
                            {gage.notes}
                          </p>
                          <button
                            onClick={() => setSelectedGage({ ...gage, showNotes: true })}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">-</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Buttons */}
              <div className="flex justify-between items-end pt-2 gap-2 mt-auto">
                <button
                  onClick={() => {
                    setSelectedGage(gage);
                    setShowSchedule(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-700 text-white rounded hover:bg-green-800 text-xs font-medium"
                >
                  <Calendar size={14} /> Schedule
                </button>
                <button
                  onClick={() => {
                    setEditingGage(gage);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => onRetire(gage.id, gage.gageType?.name)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs font-medium"
                >
                  <Archive size={14} /> Retire
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-2 py-1 text-sm bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            className="px-2 py-1 text-sm bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      {/* Modals */}
      {showSchedule && selectedGage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl overflow-y-auto max-h-full">
            <ScheduleCalibration
              gage={selectedGage}
              onClose={() => {
                setShowSchedule(false);
                setSelectedGage(null);
              }}
            />
          </div>
        </div>
      )}
      {showEditModal && editingGage && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white border rounded-xl shadow-md p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <EditGage
              gage={editingGage}
              onCancel={() => setShowEditModal(false)}
              onUpdated={(updatedGage) => {
                onUpdated(updatedGage);
                setShowEditModal(false);
              }}
            />
          </div>
        </div>
      )}
      {manualPreviewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative flex flex-col">
            <button
              onClick={() => setManualPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <iframe
              src={manualPreviewUrl}
              title="Manual Preview"
              className="w-full h-full"
            />
            <div className="absolute bottom-3 right-3">
              <a
                href={manualPreviewUrl}
                download="GageManual.pdf"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <Download size={18} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative">
            <img
              src={previewImageUrl}
              alt="Full Gage Image"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-3 right-3">
              <a
                href={previewImageUrl}
                download="GageImage.jpg"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <Download size={18} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Enhanced Media Gallery Modal with Videos */}
      {previewImageGallery.images && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setPreviewImageGallery([])}
              className="absolute top-4 right-4 z-10 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
            >
              <X size={20} />
            </button>
           
            <div className="p-6 h-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Gage Media Gallery
                ({previewImageGallery.images.length} photos
                {previewImageGallery.videos?.length > 0 ? `, ${previewImageGallery.videos.length} videos` : ''})
              </h3>
             
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
                {/* Photos */}
                {previewImageGallery.images.map((base64, idx) => (
                  <div
                    key={`img-${idx}`}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => setPreviewImageUrl(`data:image/jpeg;base64,${base64}`)}
                  >
                    <div className="relative">
                      <img
                        src={`data:image/jpeg;base64,${base64}`}
                        alt={`Gage Photo ${idx + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={24} />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 text-center">
                      <span className="text-sm font-semibold text-gray-700">Photo {idx + 1}</span>
                    </div>
                  </div>
                ))}
               
                {/* Videos */}
                {previewImageGallery.videos?.map((base64, idx) => (
                  <div
                    key={`vid-${idx}`}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => setPreviewVideo(base64)}
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                        <div className="bg-black bg-opacity-60 rounded-full p-4">
                          <Play className="text-white" size={24} fill="white" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={32} fill="white" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-center">
                      <span className="text-sm font-semibold text-gray-700 flex items-center justify-center gap-1">
                        <Video size={14} />
                        Video {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
             
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Click on any image to view it in full size, or click on any video to play it
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Video Player Modal */}
      {previewVideo && (
        <VideoPlayerModal
          videoBase64={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}
      {selectedGage?.showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#005797] rounded-t-lg">
              <h3 className="text-white font-medium text-lg">Notes</h3>
              <button
                onClick={() => setSelectedGage(null)}
                className="text-white hover:text-gray-200 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-gray-800 text-sm whitespace-pre-wrap">
              {selectedGage.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const Field = ({ icon: Icon, label, value, color = "text-gray-500" }) => (
  <div className="flex flex-col gap-0.5 bg-gray-50 px-2 py-1.5 rounded">
    <div className="flex items-center gap-1">
      <Icon size={14} className={color} />
      <span className="text-xs font-semibold text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-medium ml-5 text-gray-800">{value || "-"}</span>
  </div>
);
export default GageCardView;