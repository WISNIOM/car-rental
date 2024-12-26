import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateVehicleBrandDto } from './create-vehicle-brand.dto';

export class VehicleBrandDto extends PickType(CreateVehicleBrandDto, [
  'name',
] as const) {
  @ApiProperty({ example: 1, description: 'The unique identifier of the vehicle brand.' })
  id: number;
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z', description: 'The date and time when the vehicle brand was created.' })
  createdAt: Date;
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z', description: 'The date and time when the vehicle brand was last updated.' })
  updatedAt: Date;
}
