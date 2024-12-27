import { PickType } from '@nestjs/swagger';
import { VehicleBrandDto } from './vehicle-brand.dto';
export class CreateVehicleBrandDto extends PickType(VehicleBrandDto, [
  'name',
] as const) {}