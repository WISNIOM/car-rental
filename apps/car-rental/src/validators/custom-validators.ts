/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[doesNotContainPolishLetters]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: DoesNotContainPolishLettersDirective, multi: true }]
})
export class DoesNotContainPolishLettersDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return CustomValidators.doesNotContainPolishLetters()(control);
  }
}

@Directive({
  selector: '[doesContainOnlyDigitsAndUppercaseLetters]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: DoesContainOnlyDigitsAndUppercaseLettersDirective, multi: true }]
})
export class DoesContainOnlyDigitsAndUppercaseLettersDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return CustomValidators.doesContainOnlyDigitsAndUppercaseLetters()(control);
  }
}

@Directive({
  selector: '[doesNotContainSpecificLetters]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: DoesNotContainSpecificLettersDirective, multi: true }]
})
export class DoesNotContainSpecificLettersDirective implements Validator {
  @Input('doesNotContainSpecificLetters') letters: string[] = [];
  @Input() letterIndex = 0;

  validate(control: AbstractControl): ValidationErrors | null {
    return CustomValidators.doesNotContainSpecificLetters(this.letters, this.letterIndex)(control);
  }
}
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
      if (value) {
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
