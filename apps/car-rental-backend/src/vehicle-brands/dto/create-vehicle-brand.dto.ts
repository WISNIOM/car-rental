import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsFirstLetterUppercase } from '../../validators/is-first-letter-uppercase.decorator';
export class CreateVehicleBrandDto {
  @IsString()
  @Length(1, 50)
  @IsFirstLetterUppercase()
  @ApiProperty({
    example: 'Toyota',
    description: 'The name of the vehicle brand. The first character must be uppercase. Allowed length is 1-50 characters.',
    type: 'string',
  })
  name: string;
}
