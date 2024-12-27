import { IsFirstLetterUppercaseConstraint } from './is-first-letter-uppercase.decorator';

describe('IsFirstLetterUppercaseConstraint', () => {
  let constraint: IsFirstLetterUppercaseConstraint;

  beforeEach(() => {
    constraint = new IsFirstLetterUppercaseConstraint();
  });

  describe('validate', () => {
    it('should return true for a string with the first letter uppercase', () => {
      expect(constraint.validate('Hello')).toBe(true);
    });

    it('should return false for a string with the first letter lowercase', () => {
      expect(constraint.validate('hello')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(constraint.validate('')).toBe(false);
    });

    it('should return false for a string starting with a non-letter character', () => {
      expect(constraint.validate('1Hello')).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      expect(constraint.defaultMessage()).toBe(
        'The first letter of the text must be uppercase'
      );
    });
  });
});
