import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOficinaDto } from './create-oficina.dto';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateOficinaDto extends PartialType(CreateOficinaDto) {
  @ApiProperty({
    example: 'OF-101',
    description: 'Código único de la oficina',
    required: false,
  })
  @IsString()
  codigo?: string;

  @ApiProperty({
    example: '68c65a10019def9a6b7b94d4',
    description: 'ID del área a la que pertenece la oficina',
    required: false,
  })
  @IsMongoId()
  area?: string;
}
