import { OmitType, PartialType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

export class UpdateVehicleDto extends PartialType(
  OmitType(VehicleDto, ['id', 'createdAt', 'updatedAt'] as const)
) {}
