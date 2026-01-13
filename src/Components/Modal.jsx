export default function Modal({ title, onClose, children, isOpen = true }) {
  // Backwards-compatible: if isOpen is explicitly false, hide; otherwise render
  if (isOpen === false) return null;
  
  const handleBackdropClick = (e) => {
    // Close only if clicking on the backdrop, not the modal itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={handleBackdropClick}
    >
      {/* Modal box */}
      <div className="bg-white rounded-lg shadow-lg w-auto max-w-6xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#005797] px-4 py-3 relative">
          {/* Centered Title */}
          <h2 className="text-white text-lg font-semibold text-center flex items-center justify-center gap-2">
            {title}
          </h2>

          {/* Close Button (absolute right) */}
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
