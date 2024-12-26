import {
    registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFirstLetterUppercase', async: false })
export class IsFirstLetterUppercaseConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string) {
    return /^[A-Z]/.test(text);
  }

  defaultMessage() {
    return 'The first letter of the text must be uppercase';
  }
}


export function IsFirstLetterUppercase(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFirstLetterUppercaseConstraint,
    });
  };
}