import React from 'react';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Boxes, 
  Store, 
  Database,
  X,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  productCount, 
  isOpen, 
  onClose 
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: PackagePlus,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Product Inventory',
      icon: Boxes,
      badge: productCount > 0 ? productCount : null
    }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Store size={22} className="brand-icon" />
          </div>
          <div className="brand-info">
            <span className="brand-name">SellerDesk</span>
            <span className="brand-tagline">Inventory Manager</span>
          </div>
          <button 
            type="button" 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-section-label">MAIN NAVIGATION</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <div className="nav-item-content">
                  <Icon size={19} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`nav-badge ${isActive ? 'active-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Storage Status Footer */}
        <div className="sidebar-footer">
          <div className="storage-card">
            <div className="storage-header">
              <Database size={15} className="storage-icon" />
              <span className="storage-title">Local Storage</span>
              <span className="storage-status-dot" title="Persistent Local Storage Active" />
            </div>
            <p className="storage-desc">
              Data is synced automatically & preserved on refresh.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

