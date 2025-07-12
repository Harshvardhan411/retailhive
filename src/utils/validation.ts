// src/utils/validation.ts

/**
 * Checks if a value is not empty (required field).
 * @param value - The string to check
 * @returns True if the value is not empty
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Checks if a value is a valid email address.
 * @param value - The string to check
 * @returns True if the value is a valid email
 */
export function isEmail(value: string): boolean {
  // Simple regex for demonstration; consider using a more robust one for production
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

/**
 * Checks if a value is a valid phone number (basic check).
 * @param value - The string to check
 * @returns True if the value is a valid phone number
 */
export function isPhone(value: string): boolean {
  // Accepts numbers with optional + and 7-15 digits
  return /^\+?\d{7,15}$/.test(value.replace(/\s+/g, ''));
}

/**
 * Checks if a value is within a specified length range.
 * @param value - The string to check
 * @param min - Minimum length (inclusive)
 * @param max - Maximum length (inclusive)
 * @returns True if the value is within the range
 */
export function isLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
} 