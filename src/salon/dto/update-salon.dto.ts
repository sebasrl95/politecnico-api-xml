import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonDto } from './create-salon.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId } from 'class-validator';

export class UpdateSalonDto extends PartialType(CreateSalonDto) {
  @ApiProperty({
    example: 'SAL-201',
    description: 'Código único del salón de clase',
    required: false,
  })
  @IsString()
  codigo?: string;

  @ApiProperty({
    example: '68c65a10019def9a6b7b94d4',
    description: 'ID del área a la que pertenece el salón',
    required: false,
  })
  @IsMongoId()
  area?: string;
}
