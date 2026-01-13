// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./auth/AuthContext";
import { SystemTimeoutProvider } from "./auth/SystemTimeoutContext";
import { CallProvider } from "./auth/CallContext"; // Add this import
import { useAuth } from "./auth/AuthContext"; // Add this import

// Create a wrapper component to provide currentUser to CallProvider
function AppWithProviders() {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  
  return (
    <CallProvider currentUser={currentUser}> {/* Wrap with CallProvider */}
      <AppRoutes />
    </CallProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SystemTimeoutProvider>
          <AppWithProviders /> {/* Use the wrapper component */}
        </SystemTimeoutProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;