import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  describe('doesNotContainSpecificLetters', () => {
    it('should return null if control value is empty', () => {
      const control = new FormControl('');
      const validator = CustomValidators.doesNotContainSpecificLetters([
        'A',
        'B',
      ]);
      expect(validator(control)).toBeNull();
    });

    it('should return null if letters array is empty', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters([]);
      expect(validator(control)).toBeNull();
    });

    it('should return null if letterIndex is greater than value length', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters(
        ['A', 'B'],
        5
      );
      expect(validator(control)).toBeNull();
    });

    it('should return null if none of the specific letters are found', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters([
        'A',
        'B',
      ]);
      expect(validator(control)).toBeNull();
    });

    it('should return an error object if any of the specific letters are found', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters([
        'E',
        'S',
      ]);
      expect(validator(control)).toEqual({
        doesNotContainSpecificLetters: true,
      });
    });

    it('should return an error object if any of the specific letters are found after the specified index', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters(
        ['S'],
        2
      );
      expect(validator(control)).toEqual({
        doesNotContainSpecificLetters: true,
      });
    });

    it('should return null if specific letters are found before the specified index', () => {
      const control = new FormControl('TEST');
      const validator = CustomValidators.doesNotContainSpecificLetters(
        ['E'],
        2
      );
      expect(validator(control)).toBeNull();
    });
  });
});
