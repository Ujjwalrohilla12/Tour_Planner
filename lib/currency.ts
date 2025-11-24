/**
 * Utility functions for currency formatting
 */

/**
 * Formats a number or string to Indian Rupees format
 * @param amount - The amount to format (number or string)
 * @returns Formatted string with ₹ symbol
 */
export function formatToRupees(amount: number | string): string {
  if (typeof amount === 'string') {
    // If already has ₹ symbol, return as is
    if (amount.includes('₹')) {
      return amount;
    }
    // If has other currency symbols, replace them
    if (amount.includes('$') || amount.includes('€') || amount.includes('£')) {
      const numericValue = amount.replace(/[^\d.]/g, '');
      return `₹${numericValue}`;
    }
    // If it's just a number string, add ₹
    const numericValue = parseFloat(amount);
    if (!isNaN(numericValue)) {
      return `₹${numericValue.toLocaleString('en-IN')}`;
    }
    return amount;
  }
  
  if (typeof amount === 'number') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  
  return String(amount);
}

/**
 * Formats pricing text to ensure it uses rupees
 * @param priceText - The price text to format
 * @returns Formatted price text with ₹ symbol
 */
export function formatPriceText(priceText: string): string {
  if (!priceText) return priceText;
  
  // If already has ₹, return as is
  if (priceText.includes('₹')) {
    return priceText;
  }
  
  // Replace other currency symbols with ₹
  let formatted = priceText
    .replace(/\$/g, '₹')
    .replace(/€/g, '₹')
    .replace(/£/g, '₹')
    .replace(/USD/g, '₹')
    .replace(/EUR/g, '₹')
    .replace(/GBP/g, '₹');
  
  // If no currency symbol found but contains numbers, add ₹ at the beginning
  if (!/₹/.test(formatted) && /\d/.test(formatted)) {
    const match = formatted.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      formatted = formatted.replace(match[0], `₹${match[0]}`);
    }
  }
  
  return formatted;
}

/**
 * Converts common currency amounts to approximate INR values
 * @param amount - Amount with currency symbol
 * @returns Approximate INR amount
 */
export function convertToINR(amount: string): string {
  const numericValue = parseFloat(amount.replace(/[^\d.]/g, ''));
  
  if (isNaN(numericValue)) return amount;
  
  let inrValue = numericValue;
  
  // Rough conversion rates (these should ideally come from an API)
  if (amount.includes('$') || amount.includes('USD')) {
    inrValue = numericValue * 83; // 1 USD ≈ 83 INR
  } else if (amount.includes('€') || amount.includes('EUR')) {
    inrValue = numericValue * 90; // 1 EUR ≈ 90 INR
  } else if (amount.includes('£') || amount.includes('GBP')) {
    inrValue = numericValue * 105; // 1 GBP ≈ 105 INR
  }
  
  return `₹${Math.round(inrValue).toLocaleString('en-IN')}`;
}