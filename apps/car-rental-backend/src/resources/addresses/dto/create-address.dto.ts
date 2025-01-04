import { PickType } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class CreateAddressDto extends PickType(AddressDto, [
  'administrativeArea',
  'city',
  'country',
  'postalCode',
  'street',
] as const) {}
