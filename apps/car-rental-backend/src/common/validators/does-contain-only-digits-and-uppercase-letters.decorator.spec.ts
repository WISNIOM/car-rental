import { DoesContainOnlyDigitsAndUppercaseLettersConstraint } from './does-contain-only-digits-and-uppercase-letters.decorator';

describe('DoesContainOnlyDigitsAndUppercaseLettersConstraint', () => {
  let constraint: DoesContainOnlyDigitsAndUppercaseLettersConstraint;

  beforeEach(() => {
    constraint = new DoesContainOnlyDigitsAndUppercaseLettersConstraint();
  });

  describe('validate', () => {
    it('should return true for a string with only uppercase letters and digits', () => {
      expect(constraint.validate('ABC123')).toBe(true);
    });

    it('should return false for a string with lowercase letters', () => {
      expect(constraint.validate('abc123')).toBe(false);
    });

    it('should return false for a string with special characters', () => {
      expect(constraint.validate('ABC123!@#')).toBe(false);
    });

    it('should return true for an empty string', () => {
      expect(constraint.validate('')).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      expect(constraint.defaultMessage()).toBe(
        'The text must contain only uppercase letters and digits.'
      );
    });
  });
});
