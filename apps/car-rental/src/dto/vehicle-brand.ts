export type VehicleBrandDto = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateVehicleBrandDto = Pick<VehicleBrandDto, 'name'>;
export type UpdateVehicleBrandDto = Pick<VehicleBrandDto, 'name'>;