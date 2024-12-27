import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type DoesNotContainSpecificLettersOptions = {
  letters: Array<string>;
  letterIndex?: number;
  validationOptions?: ValidationOptions;
};

@ValidatorConstraint({ name: 'doesNotContainSpecificLetters', async: false })
export class DoesNotContainSpecificLettersConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    const [lettersConstraintName, letterIndexConstraintName] = args.constraints;
    const letters = args.object[lettersConstraintName];
    const letterIndex = args.object[letterIndexConstraintName];
    if (!letters) {
      return true;
    }
    if (letterIndex) {
      if (letterIndex > text.length) {
        return true;
      }
      const textFromIndex = text.slice(letterIndex);
      return !letters.some((letter: string) => textFromIndex.includes(letter));
    }
    return !letters.some((letter: string) => text.includes(letter));
  }
}

export function DoesNotContainSpecificLetters({
  letters,
  letterIndex,
  validationOptions,
}: DoesNotContainSpecificLettersOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [letters, letterIndex],
      validator: DoesNotContainSpecificLettersConstraint,
    });
  };
}
