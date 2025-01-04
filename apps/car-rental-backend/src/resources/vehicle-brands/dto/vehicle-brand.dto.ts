import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsFirstLetterUppercase } from '../../../common/validators/is-first-letter-uppercase.decorator';

export class VehicleBrandDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the vehicle brand.',
  })
  id: number;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the vehicle brand was created.',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The date and time when the vehicle brand was last updated.',
  })
  updatedAt: Date;
  @IsString()
  @Length(1, 50)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Toyota',
    description:
      'The name of the vehicle brand. The first character must be uppercase. Allowed length is 1-50 characters.',
    type: 'string',
  })
  name: string;
}
