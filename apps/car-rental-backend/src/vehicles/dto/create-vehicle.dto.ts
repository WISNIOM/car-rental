import { PickType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

export class CreateVehicleDto extends PickType(VehicleDto, [
  'brand',
  'registrationNumber',
  'vehicleIdentificationNumber',
] as const) {}
