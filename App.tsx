import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import type { Medicine } from './types';
import AuthCard from './components/auth/AuthCard';
import Overview from './components/dashboard/Overview';
import InventoryTable from './components/inventory/InventoryTable';
import InventoryForm from './components/inventory/InventoryForm';
import DispenseModal from './components/inventory/DispenseModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LogOut } from 'lucide-react';
import './App.css';

// Subcomponent that runs within the InventoryProvider context
const InventoryDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Dialog/Modal UI states (CO3 state as dynamic runtime data)
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [dispenseMedicineItem, setDispenseMedicineItem] = useState<Medicine | null>(null);

  const handleOpenAddModal = () => {
    setSelectedMedicine(null);
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowAddEditModal(true);
  };

  const handleOpenDispenseModal = (medicine: Medicine) => {
    setDispenseMedicineItem(medicine);
    setShowDispenseModal(true);
  };

  const handleCloseModals = () => {
    setShowAddEditModal(false);
    setSelectedMedicine(null);
    setShowDispenseModal(false);
    setDispenseMedicineItem(null);
  };

  return (
    <div className="app-container">
      {/* Dynamic Header Navbar */}
      <header className="app-navbar">
        <div className="nav-brand">
          <div className="logo-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="logo-text">PharmSphere</span>
          </div>
        </div>

        <div className="nav-user-info">
          <div className="user-badge">
            <span className={`role-badge role-${user?.role || 'pharmacist'}`}>
              {user?.role || ''}
            </span>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main panel isolated inside an ErrorBoundary to demonstrate JS error capturing (CO2, CO4) */}
      <main className="main-content">
        <ErrorBoundary>
          {/* Dashboard KPIs and charts */}
          <Overview />

          {/* Main Inventory Grid list */}
          <InventoryTable
            onAddClick={handleOpenAddModal}
            onEditClick={handleOpenEditModal}
            onDispenseClick={handleOpenDispenseModal}
          />
        </ErrorBoundary>
      </main>

      {/* Modals Layout Layers with Key-based state resets (CO3) */}
      {showAddEditModal && (
        <InventoryForm
          key={selectedMedicine?.id || 'new'}
          medicine={selectedMedicine}
          onClose={handleCloseModals}
        />
      )}

      {showDispenseModal && dispenseMedicineItem && (
        <DispenseModal
          key={dispenseMedicineItem.id}
          medicine={dispenseMedicineItem}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <div className="auth-page-container">
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  // Unauthenticated Flow
  if (!user) {
    return (
      <div className="auth-page-container">
        <AuthCard />
      </div>
    );
  }

  // Authenticated Flow with dynamic context mounting
  return (
    <InventoryProvider>
      <InventoryDashboard />
    </InventoryProvider>
  );
};

export default App;
