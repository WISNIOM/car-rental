import { PickType } from '@nestjs/swagger';
import { CreateVehicleBrandDto } from './create-vehicle-brand.dto';

export class VehicleBrandDto extends PickType(CreateVehicleBrandDto, [
  'name',
] as const) {}
