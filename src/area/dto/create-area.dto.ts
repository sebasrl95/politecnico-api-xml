import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({
    example: 'Area XXX',
    description: 'Nombre del área',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
