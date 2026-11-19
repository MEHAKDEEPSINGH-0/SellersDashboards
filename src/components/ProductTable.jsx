import React, { useState, useMemo } from 'react';
import { CATEGORIES, CATEGORY_STYLES } from '../constants/categories';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus, 
  Boxes, 
  ArrowUpDown, 
  RotateCcw,
  Package,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function ProductTable({ 
  products, 
  onInitiateEdit, 
  onInitiateDelete, 
  onNavigateToAdd 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'qty-asc') {
        return a.quantity - b.quantity;
      }
      if (sortBy === 'qty-desc') {
        return b.quantity - a.quantity;
      }
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Total quantity for filtered view
  const filteredTotalQuantity = useMemo(() => {
    return filteredProducts.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  }, [filteredProducts]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSortBy('newest');
  };

  return (
    <div className="inventory-view-container">
      {/* Header section */}
      <div className="inventory-page-header">
        <div>
          <div className="badge-wrapper">
            <span className="page-badge badge-primary">
              <Boxes size={13} />
              Inventory Central
            </span>
          </div>
          <h2 className="page-heading">Product Inventory</h2>
          <p className="page-subheading">
            Manage, inspect, search, and update your complete catalog stored in Local Storage.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={onNavigateToAdd}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="inventory-toolbar">
        {/* Search input */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="filter-item-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories ({products.length})</option>
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Sort selector */}
        <div className="filter-item-wrapper">
          <ArrowUpDown size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="qty-desc">Sort: Quantity (High to Low)</option>
            <option value="qty-asc">Sort: Quantity (Low to High)</option>
          </select>
        </div>

        {(searchQuery || selectedCategory !== 'ALL' || sortBy !== 'newest') && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
            title="Reset filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Inventory Summary Stats Strip */}
      <div className="inventory-summary-strip">
        <div className="summary-chip">
          <span className="chip-label">Showing:</span>
          <span className="chip-value">{filteredProducts.length} of {products.length} Products</span>
        </div>
        <div className="summary-chip">
          <span className="chip-label">Total Stock in View:</span>
          <span className="chip-value">{filteredTotalQuantity.toLocaleString()} Units</span>
        </div>
      </div>

      {/* Inventory Table or Empty State */}
      {products.length === 0 ? (
        // Completely empty state (no products in Local Storage)
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <Package size={48} />
          </div>
          <h3 className="empty-state-title">No Products in Inventory</h3>
          <p className="empty-state-text">
            Your inventory is currently empty. Add your first product to start tracking your stock in Local Storage.
          </p>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onNavigateToAdd}
          >
            <Plus size={16} />
            <span>Add Your First Product</span>
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty state due to search or filter
        <div className="empty-state-card">
          <div className="empty-state-icon text-muted">
            <Search size={48} />
          </div>
          <h3 className="empty-state-title">No Matching Products Found</h3>
          <p className="empty-state-text">
            We couldn't find any products matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
            {selectedCategory !== 'ALL' ? ` in category "${selectedCategory}"` : ''}.
          </p>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleClearFilters}
          >
            <RotateCcw size={15} />
            <span>Clear Filters & Search</span>
          </button>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Product ID</th>
                <th style={{ width: '35%' }}>Product Name</th>
                <th style={{ width: '18%' }}>Quantity</th>
                <th style={{ width: '17%' }}>Category</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const catStyle = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.Other;
                const isLowStock = Number(product.quantity) <= 5;

                return (
                  <tr key={product.id} className="table-row">
                    {/* Product ID */}
                    <td className="col-id">
                      <span className="product-id-pill" title={`Unique ID: ${product.id}`}>
                        {product.id}
                      </span>
                    </td>

                    {/* Product Name */}
                    <td className="col-name">
                      <div className="product-name-cell">
                        <span className="product-name-text">{product.name}</span>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="col-quantity">
                      <div className="quantity-wrapper">
                        <span className="quantity-number">{product.quantity}</span>
                        {isLowStock && (
                          <span className="stock-pill low-stock" title="Low stock alert (<= 5 units)">
                            <AlertCircle size={12} />
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="col-category">
                      <span 
                        className="category-pill"
                        style={{
                          backgroundColor: catStyle.bg,
                          color: catStyle.text,
                          borderColor: catStyle.border
                        }}
                      >
                        {product.category}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="col-actions" style={{ textAlign: 'right' }}>
                      <div className="table-actions-group">
                        <button
                          type="button"
                          className="action-btn edit-action-btn"
                          onClick={() => onInitiateEdit(product)}
                          title={`Edit ${product.name}`}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit3 size={15} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-action-btn"
                          onClick={() => onInitiateDelete(product)}
                          title={`Delete ${product.name}`}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={15} />
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
  );
}

