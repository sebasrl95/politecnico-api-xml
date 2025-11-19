import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OficinaService } from './oficina.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Oficina')
@Controller('oficina')
export class OficinaController {
  constructor(private readonly oficinaService: OficinaService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Oficina creada exitosamente.' })
  create(@Body() createOficinaDto: CreateOficinaDto) {
    return this.oficinaService.create(createOficinaDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista todas las oficinas.' })
  findAll() {
    return this.oficinaService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Devuelve una oficina por su ID.' })
  findOne(@Param('id') id: string) {
    return this.oficinaService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Actualiza una oficina.' })
  update(@Param('id') id: string, @Body() updateOficinaDto: UpdateOficinaDto) {
    return this.oficinaService.update(id, updateOficinaDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina una oficina.' })
  remove(@Param('id') id: string) {
    return this.oficinaService.remove(id);
  }
}
