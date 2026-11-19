import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { generateProductId } from './utils/helpers';
import './App.css';

const LOCAL_STORAGE_KEY = 'seller_products_inventory';

export default function App() {
  // Navigation view: 'dashboard' | 'add-product' | 'inventory'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Editing product pointer (null when not editing)
  const [editingProduct, setEditingProduct] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Confirmation Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null, // 'edit' | 'delete'
    product: null
  });

  // Initialize products state from Local Storage (no dummy data)
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading inventory from Local Storage:', error);
    }
    return [];
  });

  // Synchronize products to Local Storage whenever products state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving inventory to Local Storage:', error);
      showToast({
        type: 'error',
        title: 'Storage Error',
        message: 'Could not sync products with Local Storage.'
      });
    }
  }, [products]);

  // Helper to show toasts
  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
  };

  // Handle Save (Create or Update)
  const handleSaveProduct = (productData, isEditing) => {
    if (isEditing) {
      // UPDATE: modify existing object without duplicate
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === productData.id) {
            return {
              ...p,
              name: productData.name,
              quantity: productData.quantity,
              category: productData.category,
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        })
      );

      setEditingProduct(null);
      setCurrentView('inventory');
      showToast({
        type: 'success',
        title: 'Product Updated',
        message: `Product "${productData.name}" was successfully updated.`
      });
    } else {
      // CREATE: create new product with unique ID and timestamp
      const newProduct = {
        id: generateProductId(),
        name: productData.name,
        quantity: productData.quantity,
        category: productData.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      showToast({
        type: 'success',
        title: 'Product Added',
        message: `Product "${newProduct.name}" (${newProduct.id}) was successfully added to inventory.`
      });
    }
  };

  // Open Edit Confirmation Modal
  const handleInitiateEdit = (product) => {
    setModalConfig({
      isOpen: true,
      mode: 'edit',
      product
    });
  };

  // Open Delete Confirmation Modal
  const handleInitiateDelete = (product) => {
    setModalConfig({
      isOpen: true,
      mode: 'delete',
      product
    });
  };

  // Confirm Modal Action
  const handleModalConfirm = () => {
    const { mode, product } = modalConfig;

    if (mode === 'edit' && product) {
      // Seller confirmed edit -> open Add Product form with pre-filled details
      setEditingProduct(product);
      setCurrentView('add-product');
      setModalConfig({ isOpen: false, mode: null, product: null });
    } else if (mode === 'delete' && product) {
      // Seller confirmed delete -> remove only the selected product by ID
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );
      setModalConfig({ isOpen: false, mode: null, product: null });
      showToast({
        type: 'success',
        title: 'Product Deleted',
        message: `Product "${product.name}" has been removed from inventory.`
      });
    }
  };

  // Cancel Modal
  const handleModalCancel = () => {
    setModalConfig({ isOpen: false, mode: null, product: null });
  };

  // Cancel Editing mode
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setCurrentView('inventory');
  };

  // Clean navigation handler
  const handleNavigate = (viewId) => {
    if (viewId !== 'add-product') {
      setEditingProduct(null);
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        productCount={products.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          totalProducts={products.length}
        />

        {/* Dynamic View Router */}
        <main className="app-content-wrapper">
          {currentView === 'dashboard' && (
            <Dashboard
              products={products}
              onNavigate={handleNavigate}
              onInitiateEdit={handleInitiateEdit}
              onInitiateDelete={handleInitiateDelete}
            />
          )}

          {currentView === 'add-product' && (
            <ProductForm
              onSaveProduct={handleSaveProduct}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
              onNavigateToInventory={() => handleNavigate('inventory')}
            />
          )}

          {currentView === 'inventory' && (
            <ProductTable
              products={products}
              onInitiateEdit={handleInitiateEdit}
              onInitiateDelete={handleInitiateDelete}
              onNavigateToAdd={() => handleNavigate('add-product')}
            />
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        product={modalConfig.product}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

