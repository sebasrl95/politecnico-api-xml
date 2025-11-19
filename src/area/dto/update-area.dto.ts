import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaDto } from './create-area.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @ApiProperty({
    example: 'Area XXX',
    description: 'Nombre del área',
    required: false,
  })
  @IsString()
  nombre?: string;
}
