import { ApiProperty } from "@nestjs/swagger";

export class CreateVehicleBrandDto {
    @ApiProperty({ example: 'Toyota', description: 'The name of the vehicle brand', type: 'string' })
    name: string;
}
