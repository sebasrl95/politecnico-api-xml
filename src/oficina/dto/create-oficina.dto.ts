import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateOficinaDto {
  @ApiProperty({ example: 'OF-101', description: 'Código único de la oficina' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    example: 1,
    description: 'ID del área a la que pertenece la oficina',
  })
  @IsMongoId()
  @IsNotEmpty()
  area: string;
}
