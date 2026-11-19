// Generate unique product ID: PRD-XXXX
export const generateProductId = () => {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `PRD-${timestampPart}${randomPart}`;
};

// Format date nicely
export const formatDate = (isoString) => {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recent';
  }
};

