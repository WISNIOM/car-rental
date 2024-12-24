import { PickType } from '@nestjs/swagger';
import { CreateVehicleBrandDto } from './create-vehicle-brand.dto';

export class UpdateVehicleBrandDto extends PickType(CreateVehicleBrandDto, ['name'] as const) {
}
