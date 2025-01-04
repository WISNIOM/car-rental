import { PartialType } from '@nestjs/swagger/dist/type-helpers/partial-type.helper';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}