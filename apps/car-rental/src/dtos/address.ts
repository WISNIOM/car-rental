export type AddressDto = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    city: string;
    administrativeArea: string;
    postalCode: string;
    country: string;
    street: string;
}

export type CreateAddressDto = Pick<AddressDto, 'city' | 'administrativeArea' | 'postalCode' | 'country' | 'street'>;

export type UpdateAddressDto = Partial<AddressDto>;