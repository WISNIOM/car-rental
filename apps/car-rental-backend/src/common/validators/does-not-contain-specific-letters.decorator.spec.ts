import { DoesNotContainSpecificLettersConstraint } from './does-not-contain-specific-letters.decorator';
import { ValidationArguments } from 'class-validator';

describe('DoesNotContainSpecificLettersConstraint', () => {
  let constraint: DoesNotContainSpecificLettersConstraint;

  beforeEach(() => {
    constraint = new DoesNotContainSpecificLettersConstraint();
  });

  describe('validate', () => {
    it('should return true if letters are not provided', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: undefined },
        value: 'test',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('test', args)).toBe(true);
    });

    it('should return false if text contains one of the letters from the specified index', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: ['a', 'b'], letterIndex: 2 },
        value: 'teast',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('teast', args)).toBe(false);
    });

    it('should return true if text does not contain any of the letters from the specified index', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: ['a', 'b'], letterIndex: 2 },
        value: 'test',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('test', args)).toBe(true);
    });

    it('should return true if letterIndex is greater than text length', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: ['a', 'b'], letterIndex: 10 },
        value: 'test',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('test', args)).toBe(true);
    });

    it('should return false if text contains one of the letters', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: ['a', 'b'] },
        value: 'teast',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('teast', args)).toBe(false);
    });

    it('should return true if text does not contain any of the letters', () => {
      const args: ValidationArguments = {
        constraints: ['letters', 'letterIndex'],
        object: { letters: ['a', 'b'] },
        value: 'test',
        targetName: '',
        property: '',
      };

      expect(constraint.validate('test', args)).toBe(true);
    });
  });
});
