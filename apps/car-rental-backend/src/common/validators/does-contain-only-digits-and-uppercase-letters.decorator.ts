import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'doesContainOnlyDigitsAndUppercaseLetters', async: false })
export class DoesContainOnlyDigitsAndUppercaseLettersConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string) {
    const regex = /^[A-Z0-9]*$/;
    return regex.test(text);
  }

  defaultMessage() {
    return 'The text must contain only uppercase letters and digits.';
  }
}

export function DoesContainOnlyDigitsAndUppercaseLetters(
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesContainOnlyDigitsAndUppercaseLettersConstraint,
    });
  };
}
