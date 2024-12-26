import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { VehicleBrandDto } from './dto/vehicle-brand.dto';

@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandsService.create(createVehicleBrandDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(VehicleBrandDto)
  findVehicleBrands(@Query() pageOptionsDto: PageOptionsDto) {
    return this.vehicleBrandsService.findVehicleBrands(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleBrandsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto
  ) {
    return this.vehicleBrandsService.update(+id, updateVehicleBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleBrandsService.remove(+id);
  }
}
