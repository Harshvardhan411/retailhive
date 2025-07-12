import { isRequired, isEmail, isPhone, isLength } from './validation';

describe('validation utils', () => {
  test('isRequired returns true for non-empty, false for empty', () => {
    expect(isRequired('hello')).toBe(true);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired('')).toBe(false);
  });

  test('isEmail validates email addresses', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('bademail')).toBe(false);
    expect(isEmail('test@.com')).toBe(false);
  });

  test('isPhone validates phone numbers', () => {
    expect(isPhone('+1234567890')).toBe(true);
    expect(isPhone('1234567')).toBe(true);
    expect(isPhone('abc123')).toBe(false);
    expect(isPhone('')).toBe(false);
  });

  test('isLength checks string length', () => {
    expect(isLength('hello', 2, 10)).toBe(true);
    expect(isLength('h', 2, 10)).toBe(false);
    expect(isLength('helloworld!', 2, 10)).toBe(false);
  });
}); 