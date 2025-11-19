import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { TipoEmpleado, TipoProfesor } from 'src/entities/empleado.schema';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del empleado',
    required: false,
  })
  @IsString()
  nombre?: string;

  @ApiProperty({
    example: '123456789',
    description: 'Documento de identificación',
    required: false,
  })
  @IsString()
  documento?: string;

  @ApiProperty({
    example: '68c65a10019def9a6b7b94d4',
    description: 'ID del área',
    required: false,
  })
  @IsMongoId()
  @IsNotEmpty()
  area?: string;

  @ApiProperty({
    example: '68c65a10019def9a6b7b94d4',
    description: 'ID de la oficina',
    required: false,
  })
  @IsMongoId()
  @IsNotEmpty()
  oficina?: string;

  @ApiProperty({ enum: ['profesor', 'administrativo'], required: false })
  @IsEnum(TipoEmpleado)
  tipoEmpleado?: TipoEmpleado;

  @ApiProperty({ enum: TipoProfesor, required: false })
  @ValidateIf(
    (empleado: CreateEmpleadoDto) =>
      empleado.tipoEmpleado === TipoEmpleado.PROFESOR,
  )
  @IsEnum(TipoProfesor)
  tipoProfesor?: TipoProfesor;
}
