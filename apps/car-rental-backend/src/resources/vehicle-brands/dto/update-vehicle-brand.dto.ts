import { PickType } from '@nestjs/swagger';
import { VehicleBrandDto } from './vehicle-brand.dto';

export class UpdateVehicleBrandDto extends PickType(VehicleBrandDto, [
  'name',
] as const) {}
