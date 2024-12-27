import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsFirstLetterUppercase } from '../../common/validators/is-first-letter-uppercase.decorator';
import { DoesNotContainSpecificLetters } from '../../common/validators/does-not-contain-specific-letters.decorator';
import { DoesContainOnlyDigitsAndUppercaseLetters } from '../../common/validators/does-contain-only-digits-and-uppercase-letters.decorator';

export class CreateVehicleDto {
  @IsString()
  @Length(1, 50)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Toyota',
    description:
      'The brand of the vehicle. The first character must be uppercase. Allowed length is 1-50 characters.',
    type: 'string',
  })
  brand: string;

  @IsString()
  @Length(6, 7)
  @DoesContainOnlyDigitsAndUppercaseLetters()
  @DoesNotContainSpecificLetters({
    letters: ['B', 'D', 'I', 'O', 'Z'],
    letterIndex: 2,
    validationOptions: {
      message: 'The letters B, D, I, O, Z are not allowed after text index 2.',
    },
  })
  @ApiProperty({
    example: 'SB33221',
    description: '',
    type: 'string',
  })
  registrationNumber: string;

  @IsString()
  @Length(17)
  @DoesContainOnlyDigitsAndUppercaseLetters()
  @DoesNotContainSpecificLetters({
    letters: ['I', 'O', 'Q'],
    validationOptions: {
      message: 'The letters I, O, Q are not allowed.',
    },
  })
  @ApiProperty({
    example: '1FAFP34N55W122943',
    description:
      'Vehicle Identification Number. Allowed length is 17 characters. The letters I, O, Q are not allowed.',
    type: 'string',
  })
  vehicleIdentificationNumber: string;
}
