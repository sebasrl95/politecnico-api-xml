import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Área')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Area creada exitosamente.' })
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista todas las areas.' })
  findAll() {
    return this.areaService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Devuelve un area por su ID.' })
  findOne(@Param('id') id: string) {
    return this.areaService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Actualiza un area.' })
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina un area.' })
  remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
