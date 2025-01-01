import { ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static doesNotContainPolishLetters(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(value)) {
        return { doesNotContainPolishLetters: true };
      }
      return null;
    };
  }

  static doesContainOnlyDigitsAndUppercaseLetters(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && !/^[A-Z0-9]+$/.test(value)) {
        return { doesContainOnlyDigitsAndUppercaseLetters: true };
      }
      return null;
    };
  }

  static doesNotContainSpecificLetters(
    letters: string[],
    letterIndex = 0
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!letters) {
        return null;
      }
      if (letterIndex && value) {
        if (letterIndex > value.length) {
          return null;
        }
        const textFromIndex = value.slice(letterIndex);
        if (letters.some((letter: string) => textFromIndex.includes(letter))) {
          return { doesNotContainSpecificLetters: true };
        }
      }
      return null;
    };
  }
}
