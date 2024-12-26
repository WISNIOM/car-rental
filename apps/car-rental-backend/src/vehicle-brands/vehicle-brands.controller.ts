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
import { ApiConflictResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: VehicleBrandDto })
  @ApiConflictResponse({ description: 'Vehicle brand already exists' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VehicleBrandDto })
  @ApiNotFoundResponse({ description: 'Vehicle brand not found' })
  findOne(@Param('id') id: number) {
    return this.vehicleBrandsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VehicleBrandDto })
  @ApiNotFoundResponse({ description: 'Vehicle brand not found' })
  update(
    @Param('id') id: number,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto
  ) {
    return this.vehicleBrandsService.update(id, updateVehicleBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Vehicle brand removed' })
  @ApiNotFoundResponse({ description: 'Vehicle brand not found' })
  remove(@Param('id') id: number) {
    return this.vehicleBrandsService.remove(id);
  }
}
