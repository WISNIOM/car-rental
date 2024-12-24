import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';

@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandsService.create(createVehicleBrandDto);
  }

  @Get()
  findAll() {
    return this.vehicleBrandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleBrandsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleBrandDto: UpdateVehicleBrandDto) {
    return this.vehicleBrandsService.update(+id, updateVehicleBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleBrandsService.remove(+id);
  }
}
