import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { VehicleDto } from './dto/vehicle.dto';
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: VehicleDto })
  @ApiNotFoundResponse({
    description: 'Vehicle brand not found',
    example: { status: 404, error: 'Vehicle brand not found' },
  })
  @ApiConflictResponse({
    description: 'Vehicle already exists',
    example: { status: 409, error: 'Vehicle brand already exists' },
  })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(VehicleDto)
  findVehicles(@Query() pageOptionsDto: PageOptionsDto) {
    return this.vehiclesService.findVehicles(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VehicleDto })
  @ApiNotFoundResponse({ description: 'Vehicle not found', example: { status: 404, error: 'Vehicle not found' } })
  findOne(@Param('id') id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VehicleDto })
  @ApiNotFoundResponse({ description: 'Vehicle not found', example: { status: 404, error: 'Vehicle brand not found' } })
  @ApiConflictResponse({ description: 'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists', example: { status: 409, error: 'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists' } })
  update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Vehicle removed' })
  @ApiNotFoundResponse({ description: 'Vehicle not found', example: { status: 404, error: 'Vehicle not found' } })
  remove(@Param('id') id: number) {
    return this.vehiclesService.remove(id);
  }
}
