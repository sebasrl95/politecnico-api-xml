import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from 'src/entities/area.schema';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const findArea = await this.findByName(createAreaDto.nombre);
    if (findArea) {
      throw new HttpException(
        'Esta área ya se encuentra registrada',
        HttpStatus.CONFLICT,
      );
    }

    const newArea = new this.areaModel(createAreaDto);
    return newArea.save();
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel
      .find()
      .populate('oficinas')
      .populate('salones')
      .exec();
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areaModel
      .findById(id)
      .populate('oficinas')
      .populate('salones')
      .exec();
    if (!area) throw new NotFoundException('Área no encontrada');
    return area;
  }

  async findByName(nombre: string): Promise<Area | null> {
    return this.areaModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const area = await this.areaModel
      .findByIdAndUpdate(id, updateAreaDto, { new: true })
      .exec();
    if (!area) throw new NotFoundException('Área no encontrada');
    return area;
  }

  async remove(id: string): Promise<Area> {
    const area = await this.areaModel.findByIdAndDelete(id).exec();
    if (!area) throw new NotFoundException('Área no encontrada');
    return area;
  }
}
