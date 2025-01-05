import { AddressDto, CreateAddressDto } from "./address";

export type VehicleDto = {
    id: number;
    brand: string;
    registrationNumber: string;
    vehicleIdentificationNumber: string;
    clientEmail?: string;
    clientAddress?: AddressDto | CreateAddressDto;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateVehicleDto = Pick<VehicleDto, 'brand' | 'registrationNumber' | 'vehicleIdentificationNumber'>;

export type UpdateVehicleDto = Partial<Omit<VehicleDto, 'id' | 'createdAt' | 'updatedAt'>>;