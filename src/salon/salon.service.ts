import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from 'src/entities/salon.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from 'src/entities/area.schema';

@Injectable()
export class SalonService {
  constructor(
    @InjectModel(Salon.name) private readonly salonModel: Model<Salon>,
    @InjectModel(Area.name) private areaModel: Model<Area>,
  ) {}

  async create(createSalonDto: CreateSalonDto): Promise<Salon> {
    const existing = await this.salonModel.findOne({
      codigo: createSalonDto.codigo,
    });

    if (existing) {
      throw new ConflictException(
        `El salón con código ${createSalonDto.codigo} ya existe`,
      );
    }

    const salon = new this.salonModel(createSalonDto);
    const savedSalon = await salon.save();

    await this.areaModel.findByIdAndUpdate(
      createSalonDto.area,
      { $push: { salones: savedSalon._id } },
      { new: true },
    );

    return savedSalon;
  }

  async findAll(): Promise<Salon[]> {
    return this.salonModel.find().populate('area').exec();
  }

  async findOne(id: string): Promise<Salon> {
    const salon = await this.salonModel.findById(id).populate('area').exec();
    if (!salon) {
      throw new NotFoundException(`Salón con id ${id} no encontrado`);
    }
    return salon;
  }

  async update(id: string, updateSalonDto: UpdateSalonDto): Promise<Salon> {
    const salon = await this.salonModel.findById(id);
    if (!salon) throw new NotFoundException(`Salón con id ${id} no encontrado`);

    if (updateSalonDto.area && salon.area.toString() !== updateSalonDto.area) {
      await this.areaModel.findByIdAndUpdate(salon.area, {
        $pull: { salones: salon._id },
      });
      await this.areaModel.findByIdAndUpdate(updateSalonDto.area, {
        $push: { salones: salon._id },
      });
    }

    Object.assign(salon, updateSalonDto);
    return salon.save();
  }

  async remove(id: string): Promise<Salon> {
    const salon = await this.salonModel.findByIdAndDelete(id);
    if (!salon) throw new NotFoundException(`Salón con id ${id} no encontrado`);

    await this.areaModel.findByIdAndUpdate(salon.area, {
      $pull: { salones: salon._id },
    });
    return salon;
  }
}
