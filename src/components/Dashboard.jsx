import React from 'react';
import StatCard from './StatCard';
import { CATEGORIES, CATEGORY_STYLES } from '../constants/categories';
import { 
  Package, 
  Layers, 
  Boxes, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Edit3, 
  Trash2,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Dashboard({ 
  products, 
  onNavigate, 
  onInitiateEdit, 
  onInitiateDelete 
}) {
  // Compute dashboard metrics
  const totalProducts = products.length;
  
  const totalQuantity = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  
  // Unique categories currently in stock
  const activeCategories = Array.from(new Set(products.map((p) => p.category)));
  const availableCategoriesCount = activeCategories.length;

  // Low stock products (quantity <= 5)
  const lowStockProducts = products.filter((p) => Number(p.quantity) <= 5);

  // Recent products (sorted by most recently updated or created, top 5)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="dashboard-view-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-content">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Store Inventory Overview</span>
          </div>
          <h1 className="welcome-heading">Seller Dashboard</h1>
          <p className="welcome-subheading">
            Track, manage, and optimize your product inventory with real-time local persistence.
          </p>
        </div>

        <div className="welcome-quick-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onNavigate('add-product')}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => onNavigate('inventory')}
          >
            <Boxes size={16} />
            <span>View Inventory ({totalProducts})</span>
          </button>
        </div>
      </div>

      {/* Primary Stat Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          subtitle="Unique items currently tracked in catalog"
          icon={Package}
          colorClass="blue"
          badge={{ text: 'Active Catalog', type: 'badge-info' }}
        />

        <StatCard
          title="Total Quantity"
          value={totalQuantity.toLocaleString()}
          subtitle="Total aggregate units available in stock"
          icon={Layers}
          colorClass="emerald"
          badge={{ text: 'Units In Stock', type: 'badge-success' }}
        />

        <StatCard
          title="Available Categories"
          value={`${availableCategoriesCount} / ${CATEGORIES.length}`}
          subtitle={`${availableCategoriesCount} active product classifications`}
          icon={Boxes}
          colorClass="purple"
          badge={{ text: 'Categorized', type: 'badge-purple' }}
        />

        <StatCard
          title="Stock Alerts"
          value={lowStockProducts.length.toLocaleString()}
          subtitle={lowStockProducts.length > 0 ? 'Items with ≤ 5 units in stock' : 'All items sufficiently stocked'}
          icon={AlertTriangle}
          colorClass={lowStockProducts.length > 0 ? 'amber' : 'neutral'}
          badge={{ 
            text: lowStockProducts.length > 0 ? 'Low Stock' : 'Healthy', 
            type: lowStockProducts.length > 0 ? 'badge-warning' : 'badge-success' 
          }}
        />
      </div>

      {/* Middle Layout: Category Breakdown & Quick Info */}
      <div className="dashboard-grid-two-column">
        {/* Category Distribution Card */}
        <div className="dashboard-card category-breakdown-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Category Breakdown</h3>
              <p className="card-subtitle">Distribution of stock across categories</p>
            </div>
            <span className="card-header-badge">{activeCategories.length} Active</span>
          </div>

          <div className="card-body">
            {totalProducts === 0 ? (
              <div className="category-empty-state">
                <p>No products added yet to calculate category metrics.</p>
              </div>
            ) : (
              <div className="category-list">
                {CATEGORIES.map((cat) => {
                  const itemsInCat = products.filter((p) => p.category === cat);
                  const count = itemsInCat.length;
                  const qty = itemsInCat.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
                  const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
                  const catStyle = CATEGORY_STYLES[cat] || CATEGORY_STYLES.Other;

                  return (
                    <div key={cat} className="category-row">
                      <div className="category-row-top">
                        <div className="category-label-group">
                          <span 
                            className="category-indicator-dot" 
                            style={{ backgroundColor: catStyle.text }} 
                          />
                          <span className="category-row-name">{cat}</span>
                        </div>
                        <div className="category-row-stats">
                          <span className="cat-product-count">{count} {count === 1 ? 'item' : 'items'}</span>
                          <span className="cat-qty-count">({qty} units)</span>
                          <span className="cat-percentage">{percentage}%</span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: catStyle.text
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Inventory Summary / Highlights Card */}
        <div className="dashboard-card inventory-summary-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Storage & Status</h3>
              <p className="card-subtitle">Real-time local state synchronization</p>
            </div>
          </div>

          <div className="card-body status-card-body">
            <div className="status-item">
              <div className="status-item-icon">
                <TrendingUp size={20} />
              </div>
              <div className="status-item-content">
                <h4>Local Storage Persistence</h4>
                <p>Your product changes sync directly to browser Local Storage under key <code>seller_dashboard_products</code>.</p>
              </div>
            </div>

            <div className="status-item">
              <div className="status-item-icon warning">
                <AlertTriangle size={20} />
              </div>
              <div className="status-item-content">
                <h4>Inventory Warnings</h4>
                <p>
                  {lowStockProducts.length > 0 
                    ? `${lowStockProducts.length} product(s) have low stock (≤ 5 units). Check your inventory table.`
                    : 'All products currently have comfortable stock levels.'}
                </p>
              </div>
            </div>

            <div className="dashboard-callout-box">
              <p className="callout-text">
                Ready to add more products or restock current inventory?
              </p>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('add-product')}
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="dashboard-card recent-products-card">
        <div className="card-header">
          <div className="header-with-icon">
            <Clock size={20} className="header-icon" />
            <div>
              <h3 className="card-title">Recent Products</h3>
              <p className="card-subtitle">Latest items registered or modified in your inventory</p>
            </div>
          </div>

          {products.length > 0 && (
            <button 
              type="button" 
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate('inventory')}
            >
              <span>View All Inventory</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>

        <div className="card-body p-0">
          {recentProducts.length === 0 ? (
            <div className="empty-state-mini">
              <Package size={40} className="empty-icon" />
              <h4>No products added yet</h4>
              <p>Add your first product to see it appear in recent items and statistics.</p>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('add-product')}
              >
                <Plus size={14} />
                <span>Add First Product</span>
              </button>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="product-table recent-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((prod) => {
                    const catStyle = CATEGORY_STYLES[prod.category] || CATEGORY_STYLES.Other;
                    return (
                      <tr key={prod.id}>
                        <td>
                          <span className="product-id-pill">{prod.id}</span>
                        </td>
                        <td>
                          <span className="product-name-text">{prod.name}</span>
                        </td>
                        <td>
                          <span className="quantity-number">{prod.quantity} units</span>
                        </td>
                        <td>
                          <span 
                            className="category-pill"
                            style={{
                              backgroundColor: catStyle.bg,
                              color: catStyle.text,
                              borderColor: catStyle.border
                            }}
                          >
                            {prod.category}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-group">
                            <button
                              type="button"
                              className="action-btn edit-action-btn"
                              onClick={() => onInitiateEdit(prod)}
                              title={`Edit ${prod.name}`}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="action-btn delete-action-btn"
                              onClick={() => onInitiateDelete(prod)}
                              title={`Delete ${prod.name}`}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

