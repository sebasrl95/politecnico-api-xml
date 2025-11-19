import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Empleado')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Empleado creado exitosamente.' })
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista todos los empleados.' })
  findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Devuelve un empleado por su ID.' })
  findOne(@Param('id') id: string) {
    return this.empleadoService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Actualiza un empleado.' })
  update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ) {
    return this.empleadoService.update(id, updateEmpleadoDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina un empleado.' })
  remove(@Param('id') id: string) {
    return this.empleadoService.remove(id);
  }
}
