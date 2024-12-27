import { OmitType, PartialType } from '@nestjs/swagger';
import { Vehicle } from '../entities/vehicle.entity';

export class UpdateVehicleDto extends PartialType(
  OmitType(Vehicle, ['id', 'createdAt', 'updatedAt'] as const)
) {}
