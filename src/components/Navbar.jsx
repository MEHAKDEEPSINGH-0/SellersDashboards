import React from 'react';
import { Menu, Plus, PackageCheck, User } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  onToggleSidebar, 
  totalProducts 
}) {
  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'add-product':
        return 'Add New Product';
      case 'inventory':
        return 'Product Inventory';
      default:
        return 'Dashboard';
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button 
          type="button" 
          className="mobile-menu-trigger" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-breadcrumbs">
          <span className="crumb-root">Seller Dashboard</span>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Quick Add Product button if not currently on add-product page */}
        {currentView !== 'add-product' && (
          <button 
            type="button" 
            className="btn btn-primary btn-sm navbar-add-btn"
            onClick={() => onNavigate('add-product')}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        )}

        {/* Date Badge */}
        <div className="navbar-date-badge">
          <span>{todayDate}</span>
        </div>

        {/* Seller Profile Pill */}
        <div className="navbar-profile-pill">
          <div className="avatar-circle">
            <User size={16} />
          </div>
          <div className="seller-meta">
            <span className="seller-name">Seller Admin</span>
            <span className="seller-role">Verified Seller</span>
          </div>
        </div>
      </div>
    </header>
  );
}

