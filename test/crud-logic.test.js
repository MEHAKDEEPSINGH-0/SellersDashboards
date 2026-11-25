import test from 'node:test';
import assert from 'node:assert';
import { CATEGORIES } from '../src/constants/categories.js';
import { generateProductId } from '../src/utils/helpers.js';

test('CRUD Operations & State Simulation Suite', async (t) => {
  // Mock Local Storage
  const mockStorage = {};
  const LOCAL_STORAGE_KEY = 'seller_products_inventory';

  const setItem = (key, val) => {
    mockStorage[key] = String(val);
  };

  const getItem = (key) => {
    return mockStorage[key] || null;
  };

  // 1. Initial State from Local Storage (Starts Empty)
  let products = [];
  const stored = getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    products = JSON.parse(stored);
  }
  assert.strictEqual(products.length, 0, 'Initial products should be empty');

  // 2. CREATE (Add products)
  const product1 = {
    id: generateProductId(),
    name: 'Wireless Bluetooth Headset',
    quantity: 15,
    category: 'Electronics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products = [product1, ...products];
  setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));

  assert.strictEqual(products.length, 1);
  assert.strictEqual(products[0].name, 'Wireless Bluetooth Headset');
  assert.strictEqual(products[0].quantity, 15);
  assert.strictEqual(products[0].category, 'Electronics');

  // Add Product 2
  const product2 = {
    id: generateProductId(),
    name: 'Classic Denim Jacket',
    quantity: 4, // Low stock test
    category: 'Clothing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products = [product2, ...products];
  setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));

  assert.strictEqual(products.length, 2);

  // Add Product 3
  const product3 = {
    id: generateProductId(),
    name: 'Dark Roast Espresso Beans',
    quantity: 60,
    category: 'Food',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products = [product3, ...products];
  setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));

  assert.strictEqual(products.length, 3);

  // 3. READ & STATS COMPUTATION
  // Total products
  const totalProducts = products.length;
  assert.strictEqual(totalProducts, 3);

  // Total quantity
  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  assert.strictEqual(totalQuantity, 15 + 4 + 60); // 79

  // Available categories
  const activeCategories = Array.from(new Set(products.map((p) => p.category)));
  assert.strictEqual(activeCategories.length, 3);
  assert.ok(activeCategories.includes('Electronics'));
  assert.ok(activeCategories.includes('Clothing'));
  assert.ok(activeCategories.includes('Food'));

  // Low stock calculation (quantity <= 5)
  const lowStock = products.filter((p) => p.quantity <= 5);
  assert.strictEqual(lowStock.length, 1);
  assert.strictEqual(lowStock[0].name, 'Classic Denim Jacket');

  // Search by name filter
  const searchResults = products.filter((p) => p.name.toLowerCase().includes('denim'));
  assert.strictEqual(searchResults.length, 1);
  assert.strictEqual(searchResults[0].id, product2.id);

  // Filter by category
  const foodResults = products.filter((p) => p.category === 'Food');
  assert.strictEqual(foodResults.length, 1);
  assert.strictEqual(foodResults[0].id, product3.id);

  // 4. UPDATE (Edit Product without duplicate)
  const updatedData = {
    id: product2.id,
    name: 'Classic Denim Jacket - Edition 2',
    quantity: 25,
    category: 'Clothing',
    updatedAt: new Date().toISOString()
  };

  products = products.map((p) => {
    if (p.id === updatedData.id) {
      return {
        ...p,
        ...updatedData
      };
    }
    return p;
  });
  setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));

  // Verify list length is STILL 3 (no duplicate created!)
  assert.strictEqual(products.length, 3, 'Updating must not create duplicates');

  const editedItem = products.find((p) => p.id === product2.id);
  assert.strictEqual(editedItem.name, 'Classic Denim Jacket - Edition 2');
  assert.strictEqual(editedItem.quantity, 25);
  assert.strictEqual(editedItem.createdAt, product2.createdAt, 'Original createdAt should be retained');

  // Verify low stock count is now 0 since 25 > 5
  const updatedLowStock = products.filter((p) => p.quantity <= 5);
  assert.strictEqual(updatedLowStock.length, 0);

  // 5. DELETE (Delete selected product only)
  const idToDelete = product1.id;
  products = products.filter((p) => p.id !== idToDelete);
  setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));

  assert.strictEqual(products.length, 2, 'One product should be removed');
  assert.strictEqual(products.some((p) => p.id === idToDelete), false, 'Deleted product should no longer exist');
  assert.ok(products.some((p) => p.id === product2.id), 'Product 2 must still exist');
  assert.ok(products.some((p) => p.id === product3.id), 'Product 3 must still exist');

  // 6. PERSISTENCE ROUNDTRIP (Browser Refresh Simulation)
  const savedData = getItem(LOCAL_STORAGE_KEY);
  assert.ok(savedData !== null, 'Local Storage must contain saved data');
  const reloadedProducts = JSON.parse(savedData);
  assert.strictEqual(reloadedProducts.length, 2);
  assert.strictEqual(reloadedProducts[0].id, products[0].id);
  assert.strictEqual(reloadedProducts[1].id, products[1].id);
});

