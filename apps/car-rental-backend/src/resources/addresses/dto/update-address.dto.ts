import { PartialType } from '@nestjs/swagger/dist/type-helpers/partial-type.helper';
import { AddressDto } from './address.dto';

export class UpdateAddressDto extends PartialType(AddressDto) {}