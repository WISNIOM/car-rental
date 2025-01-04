import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { DoesContainOnlyDigitsAndUppercaseLetters } from '../../../common/validators/does-contain-only-digits-and-uppercase-letters.decorator';
import { DoesNotContainSpecificLetters } from '../../../common/validators/does-not-contain-specific-letters.decorator';
import { IsFirstLetterUppercase } from '../../../common/validators/is-first-letter-uppercase.decorator';
import { AddressDto } from '../../addresses/dto/address.dto';
import { Type } from 'class-transformer';

export class VehicleDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the vehicle.',
  })
  id: number;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the vehicle was created.',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the vehicle was last updated.',
  })
  updatedAt: Date;

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
    description: 'Registration number. Allowed length is 6-7 characters.',
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

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsOptional()
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email address of the client.',
    type: 'string',
  })
  clientEmail: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  @ApiProperty({
    type: AddressDto,
    example: {
      id: 1,
      createdAt: '2021-09-01T00:00:00.000Z',
      updatedAt: '2021-09-01T00:00:00.000Z',
      city: 'Bielsko-Biała',
      administrativeArea: 'Śląskie',
      postalCode: '43-300',
      country: 'Poland',
      street: 'ul. Cieszyńska 12',
    },
    description: 'The address of the client. Max length is 100 characters.',
  })
  clientAddress: AddressDto;
}
