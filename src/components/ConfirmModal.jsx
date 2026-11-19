import React, { useEffect } from 'react';
import { AlertTriangle, Edit3, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, mode, product, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !product) return null;

  const isDelete = mode === 'delete';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button 
          className="modal-close-btn" 
          onClick={onCancel}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className={`modal-icon-badge ${isDelete ? 'danger' : 'primary'}`}>
            {isDelete ? <Trash2 size={24} /> : <Edit3 size={24} />}
          </div>
          <div>
            <h3 id="modal-title" className="modal-title">
              {isDelete ? 'Confirm Product Deletion' : 'Confirm Edit Product'}
            </h3>
            <p className="modal-subtitle">
              {isDelete 
                ? 'Are you sure you want to delete this product?' 
                : 'Do you want to edit this product’s information?'}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-product-summary">
            <div className="summary-row">
              <span className="summary-label">Product ID:</span>
              <span className="summary-value product-id-pill">{product.id}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Product Name:</span>
              <span className="summary-value summary-highlight">{product.name}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Category:</span>
              <span className="summary-value">{product.category}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Current Quantity:</span>
              <span className="summary-value">{product.quantity} units</span>
            </div>
          </div>

          <div className={`modal-notice ${isDelete ? 'danger-notice' : 'info-notice'}`}>
            <AlertTriangle size={16} />
            <span>
              {isDelete
                ? 'This action will permanently remove this item from your inventory and Local Storage.'
                : 'You will be redirected to the product form with pre-filled details to update.'}
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className={`btn ${isDelete ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {isDelete ? 'Yes, Delete Product' : 'Yes, Edit Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

