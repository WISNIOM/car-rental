import { ApiProperty } from '@nestjs/swagger';
import { IsFirstLetterUppercase } from '../../../common/validators/is-first-letter-uppercase.decorator';
import { IsString, Length } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the address.',
  })
  id: number;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the address was created.',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the address was last updated.',
  })
  updatedAt: Date;

  @IsString()
  @Length(1, 100)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Bielsko-Biała',
    description: 'The city of the address.',
    type: 'string',
  })
  city: string;

  @IsString()
  @Length(1, 100)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Śląskie',
    description: 'The administrative area of the address.',
    type: 'string',
  })
  administrativeArea: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty({
    example: '43-300',
    description: 'The postal code of the address.',
    type: 'string',
  })
  postalCode: string;

  @IsString()
  @Length(1, 100)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Poland',
    description: 'The country of the address.',
    type: 'string',
  })
  country: string;

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    example: 'ul. 3 Maja 5',
    description: 'The street of the address.',
    type: 'string',
  })
  street: string;
}
