import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSalonDto {
  @ApiProperty({
    example: 'SAL-201',
    description: 'Código único del salón de clase',
  })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    example: 1,
    description: 'ID del área a la que pertenece el salón',
  })
  @IsMongoId()
  @IsNotEmpty()
  area: string;
}
