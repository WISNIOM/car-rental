import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { UpdateAddressDto } from '../../addresses/dto/update-address.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVehicleDto extends PartialType(
  OmitType(VehicleDto, [
    'id',
    'createdAt',
    'updatedAt',
    'clientAddress',
  ] as const)
) {
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateAddressDto || CreateAddressDto)
  @ApiProperty({
    description: 'The address of the client who rented the vehicle.',
    type: UpdateAddressDto || CreateAddressDto,
    examples: [
      {
        id: 1,
        createdAt: '2021-09-01T00:00:00.000Z',
        updatedAt: '2021-09-01T00:00:00.000Z',
        city: 'Bielsko-Biała',
        administrativeArea: 'Śląskie',
        postalCode: '43-300',
        country: 'Poland',
        street: 'ul. Cieszyńska 12',
      },
      {
        city: 'Bielsko-Biała',
        administrativeArea: 'Śląskie',
        postalCode: '43-300',
        country: 'Poland',
        street: 'ul. Cieszyńska 12',
      },
    ],
  })
  clientAddress?: UpdateAddressDto | CreateAddressDto;
}
