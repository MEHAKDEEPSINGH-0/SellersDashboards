import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants/categories';
import { 
  PackagePlus, 
  Edit3, 
  Check, 
  RotateCcw, 
  X, 
  AlertCircle,
  Tag,
  Hash,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProductForm({ 
  onSaveProduct, 
  editingProduct, 
  onCancelEdit,
  onNavigateToInventory
}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = Boolean(editingProduct);

  // When editingProduct changes (e.g. user selected edit or cancelled), sync the form values
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setQuantity(editingProduct.quantity !== undefined ? String(editingProduct.quantity) : '');
      setCategory(editingProduct.category || '');
      setErrors({});
      setTouched({});
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName('');
    setQuantity('');
    setCategory('');
    setErrors({});
    setTouched({});
  };

  const validateField = (fieldName, val) => {
    let error = '';
    if (fieldName === 'name') {
      if (!val || !val.trim()) {
        error = 'Product name is required and cannot be empty.';
      } else if (val.trim().length < 2) {
        error = 'Product name must be at least 2 characters.';
      }
    } else if (fieldName === 'quantity') {
      if (val === '' || val === null || val === undefined) {
        error = 'Product quantity is required.';
      } else {
        const num = Number(val);
        if (isNaN(num)) {
          error = 'Quantity must be a valid number.';
        } else if (!Number.isInteger(num)) {
          error = 'Quantity must be a whole integer.';
        } else if (num <= 0) {
          error = 'Quantity must be a positive number greater than 0.';
        }
      }
    } else if (fieldName === 'category') {
      if (!val || !val.trim()) {
        error = 'Please select a valid product category.';
      } else if (!CATEGORIES.includes(val)) {
        error = 'Selected category is invalid.';
      }
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = field === 'name' ? name : field === 'quantity' ? quantity : category;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateField('name', val) }));
    }
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);
    if (touched.quantity) {
      setErrors((prev) => ({ ...prev, quantity: validateField('quantity', val) }));
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    if (touched.category) {
      setErrors((prev) => ({ ...prev, category: validateField('category', val) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, quantity: true, category: true });

    // Validate all fields
    const nameErr = validateField('name', name);
    const quantityErr = validateField('quantity', quantity);
    const categoryErr = validateField('category', category);

    const validationErrors = {};
    if (nameErr) validationErrors.name = nameErr;
    if (quantityErr) validationErrors.quantity = quantityErr;
    if (categoryErr) validationErrors.category = categoryErr;

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Prepare product payload
    const productData = {
      name: name.trim(),
      quantity: parseInt(quantity, 10),
      category: category.trim()
    };

    if (isEditing) {
      productData.id = editingProduct.id;
      productData.createdAt = editingProduct.createdAt || new Date().toISOString();
      productData.updatedAt = new Date().toISOString();
    }

    // Call parent handler
    onSaveProduct(productData, isEditing);

    // Reset if it was adding a new product
    if (!isEditing) {
      resetForm();
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-page-header">
        <div className="header-text-group">
          <div className="badge-wrapper">
            <span className={`page-badge ${isEditing ? 'badge-warning' : 'badge-primary'}`}>
              {isEditing ? <Edit3 size={13} /> : <PackagePlus size={13} />}
              {isEditing ? 'Editing Mode' : 'New Inventory'}
            </span>
            {isEditing && (
              <span className="product-id-pill">
                Product ID: {editingProduct.id}
              </span>
            )}
          </div>
          <h2 className="page-heading">
            {isEditing ? 'Update Product' : 'Add New Product'}
          </h2>
          <p className="page-subheading">
            {isEditing 
              ? `Modify the details for "${editingProduct.name}". Changes will update your inventory in Local Storage.`
              : 'Fill in the required information below to register a new product into your inventory.'}
          </p>
        </div>

        {onNavigateToInventory && (
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={onNavigateToInventory}
          >
            View Inventory Table
          </button>
        )}
      </div>

      <div className="form-card-wrapper">
        <form onSubmit={handleSubmit} noValidate className="product-form">
          {/* Product Name Input */}
          <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''}`}>
            <label htmlFor="product-name" className="form-label">
              <Tag size={15} className="label-icon" />
              <span>Product Name</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="product-name"
                type="text"
                className="form-input"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                value={name}
                onChange={handleNameChange}
                onBlur={() => handleBlur('name')}
                autoComplete="off"
              />
            </div>
            {errors.name && touched.name ? (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            ) : (
              <span className="form-helper-text">
                Enter a descriptive and unique title for the item.
              </span>
            )}
          </div>

          {/* Product Quantity Input */}
          <div className={`form-group ${errors.quantity && touched.quantity ? 'has-error' : ''}`}>
            <label htmlFor="product-quantity" className="form-label">
              <Hash size={15} className="label-icon" />
              <span>Product Quantity</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="product-quantity"
                type="number"
                min="1"
                step="1"
                className="form-input"
                placeholder="e.g. 25"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={() => handleBlur('quantity')}
              />
            </div>
            {errors.quantity && touched.quantity ? (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.quantity}</span>
              </div>
            ) : (
              <span className="form-helper-text">
                Specify available stock units (must be a positive integer greater than 0).
              </span>
            )}
          </div>

          {/* Product Category Dropdown */}
          <div className={`form-group ${errors.category && touched.category ? 'has-error' : ''}`}>
            <label htmlFor="product-category" className="form-label">
              <Layers size={15} className="label-icon" />
              <span>Product Category</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper select-wrapper">
              <select
                id="product-category"
                className="form-select"
                value={category}
                onChange={handleCategoryChange}
                onBlur={() => handleBlur('category')}
              >
                <option value="" disabled>-- Select a Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && touched.category ? (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.category}</span>
              </div>
            ) : (
              <span className="form-helper-text">
                Choose the best classification for this merchandise.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions-bar">
            <div className="left-actions">
              {isEditing ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancelEdit}
                >
                  <X size={16} />
                  <span>Cancel Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={!name && !quantity && !category}
                >
                  <RotateCcw size={15} />
                  <span>Reset Form</span>
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className={`btn ${isEditing ? 'btn-warning-action' : 'btn-primary'} btn-lg submit-btn`}
            >
              {isEditing ? (
                <>
                  <Check size={18} />
                  <span>Update Product</span>
                </>
              ) : (
                <>
                  <PackagePlus size={18} />
                  <span>Submit Product</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Informative Guidance Card */}
        <div className="form-guidance-card">
          <div className="guidance-header">
            <Sparkles size={18} className="guidance-icon" />
            <h4>Inventory Tips</h4>
          </div>
          <ul className="guidance-list">
            <li>
              <strong>Instant Persistence:</strong> Products are saved to your browser’s Local Storage instantly.
            </li>
            <li>
              <strong>Auto-Generated ID:</strong> Each new product receives a unique ID format (e.g., <code>PRD-XXXX</code>).
            </li>
            <li>
              <strong>Positive Stock:</strong> Quantities must be positive numbers. Keep inventory updated when stock changes.
            </li>
            <li>
              <strong>Confirmation Safeguard:</strong> Editing and deleting items always prompt a confirmation popup to prevent accidental changes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

