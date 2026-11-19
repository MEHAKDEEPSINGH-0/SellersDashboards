# Seller Dashboard – Product Inventory Management System

A modern, responsive, and robust **Seller Dashboard** web application built with **React.js**, **CSS3**, and **Local Storage**. It allows sellers to seamlessly track, add, update, and manage their store's product inventory through a clean, intuitive SaaS interface.

---

## 🌟 Key Features

### 1. Dashboard Overview
- **Welcome Banner:** Quick greeting with direct action shortcuts.
- **Key Metrics (Real-Time Statistics):**
  - **Total Products:** Total number of unique products currently in catalog.
  - **Total Quantity:** Aggregate stock units across all products.
  - **Available Categories:** Number of active categories in stock (out of the 6 available).
  - **Stock Alerts:** Instant count of items with low inventory ($\le 5$ units).
- **Category Breakdown:** Visual distribution progress bars showing product and stock counts per category.
- **Recent Products:** Snapshot of the latest added or edited products with quick-access action triggers.

### 2. Product Form (Add & Edit Module)
- **Form Fields:**
  - **Product Name** (Text input with character validation)
  - **Product Quantity** (Number input, strictly positive whole integer $> 0$)
  - **Product Category** (Dropdown: *Electronics, Clothing, Food, Furniture, Accessories, Other*)
- **Validation & Error Handling:** Real-time feedback, prevents empty fields or non-positive stock numbers.
- **Dynamic Mode:** 
  - In *Add Mode*: Creates a new product with an auto-generated unique ID (e.g. `PRD-XXXXXX`). Resets form upon submission.
  - In *Edit Mode*: Form auto-fills with selected product's information, changes submit button to **"Update Product"**, displays an "Editing Mode" badge with the target product ID, and provides a **"Cancel Edit"** button.
- **Duplicate Prevention:** Modifies the existing product object rather than appending a duplicate.

### 3. Product Inventory Table
- **Columns:** `Product ID`, `Product Name`, `Quantity`, `Category`, and `Action`.
- **Search:** Instant real-time search filtering by product name.
- **Filter by Category:** Filter table by specific category or view all.
- **Sort Options:** Newest first, Oldest first, Name A–Z, Name Z–A, Quantity High to Low, Quantity Low to High.
- **Interactive Badges:**
  - Monospace Product ID pill.
  - Distinct colored badge for each category.
  - Dynamic stock warning badge (`Low Stock` indicator for $\le 5$ units).
- **Friendly Empty States:**
  - Empty catalog state when no products have been added yet.
  - Empty search/filter state when no items match current search query or category filter.

### 4. Confirmation Modals
- **Edit Confirmation:** Confirms intent to edit a product before redirecting to the pre-filled form.
- **Delete Confirmation:** Confirms intent with warning message (*"Are you sure you want to delete this product?"*) and deletes only the targeted product by its unique ID.
- **Accessibility:** Supports keyboard navigation (ESC key to dismiss) and backdrop click dismissal.

### 5. Local Storage Persistence
- Products are automatically retrieved on application startup.
- Synchronized using `useEffect()` and `JSON.stringify()` / `JSON.parse()`.
- Data persists across browser refreshes and tabs.
- No backend or database required.

---

## 🛠️ Technology Stack

- **Frontend Library:** React.js (v18, Functional Components & Hooks)
- **Language:** JavaScript (ES6+)
- **Styling:** Custom CSS3 with Design Tokens, Flexbox, CSS Grid, and responsive breakpoints
- **Icons:** [lucide-react](https://lucide.dev/)
- **Build Tool:** Vite 5
- **Storage:** HTML5 Local Storage API

---

## 📂 Project Structure

```text
SellersDashboard/
├── index.html                     # Application HTML entry point & Google Fonts
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── src/
│   ├── main.jsx                   # React DOM root render
│   ├── App.jsx                    # Core state management, LocalStorage sync & routing
│   ├── App.css                    # Component styles, layouts, themes, responsive CSS
│   ├── index.css                  # CSS reset, design tokens, typography
│   ├── constants/
│   │   └── categories.js          # Product categories & category color styling
│   ├── utils/
│   │   └── helpers.js             # Unique ID generator & date formatting helpers
│   └── components/
│       ├── Sidebar.jsx            # Modern sidebar with brand, navigation & storage status
│       ├── Navbar.jsx             # Top bar with breadcrumb, quick add & profile pill
│       ├── Dashboard.jsx          # Welcome heading, 4 stat cards & recent products
│       ├── ProductForm.jsx        # Validated form for Add Product & Update Product
│       ├── ProductTable.jsx       # Inventory table with search, filter, sort & actions
│       ├── ConfirmModal.jsx       # Reusable confirmation dialog for Edit & Delete
│       ├── Toast.jsx              # Auto-dismissing success and error notifications
│       └── StatCard.jsx           # Reusable metric card with badge and accent styling
└── test/
    ├── helpers.test.js            # Unit tests for helper utilities
    └── crud-logic.test.js         # Comprehensive tests for CRUD & Local Storage
```

---

## 🚀 How to Run the Application

### 1. Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### 2. Start the Development Server
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
By default, the application runs at:
```text
http://localhost:5173/
```

### 3. Run Automated Tests
Execute the built-in test suite:
```bash
npm test
```

### 4. Build for Production
Generate an optimized production build:
```bash
npm run build
```
You can preview the production build locally with:
```bash
npm run preview
```

---

## 📋 Complete CRUD Workflow Walkthrough

1. **Open Dashboard:** Navigate to `http://localhost:5173/`. Notice the initial metrics are 0 and empty states are gracefully displayed.
2. **Add a Product:** Click **"Add Product"** in the sidebar. Enter a product name, quantity (must be positive), select a category from the dropdown, and click **"Submit Product"**. A success toast confirms the creation and the form resets.
3. **View Inventory:** Click **"Product Inventory"** to see your item displayed in the table with its generated `PRD-XXXX` ID.
4. **Search & Filter:** Use the search bar to filter by name, or select a category dropdown option to filter by category.
5. **Edit a Product:** Click **"Edit"** on any item. A confirmation modal appears. Confirming redirects you to the form with all fields pre-filled and the button updated to **"Update Product"**. After updating, the item is modified in-place with no duplicates.
6. **Delete a Product:** Click **"Delete"** on any item. A confirmation modal asks *"Are you sure you want to delete this product?"*. Confirming removes only that product from inventory and Local Storage.
7. **Verify Dashboard & Persistence:** Switch to **"Dashboard"** to see your updated metrics (Total Products, Total Quantity, Available Categories, Low Stock alerts, and Recent Products). Refresh the browser to confirm all changes remain intact.
