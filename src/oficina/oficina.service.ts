import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { Oficina } from 'src/entities/oficina.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSalonDto } from 'src/salon/dto/update-salon.dto';
import { Area } from 'src/entities/area.schema';

@Injectable()
export class OficinaService {
  constructor(
    @InjectModel(Oficina.name) private oficinaModel: Model<Oficina>,
    @InjectModel(Area.name) private areaModel: Model<Oficina>,
  ) {}

  async create(createOficinaDto: CreateOficinaDto): Promise<Oficina> {
    const findOficina = await this.findByCode(createOficinaDto.codigo);
    if (findOficina) {
      throw new HttpException(
        'Esta oficina ya se encuentra registrada',
        HttpStatus.CONFLICT,
      );
    }
    const oficina = new this.oficinaModel(createOficinaDto);
    const savedOficina = await oficina.save();
    await this.areaModel.findByIdAndUpdate(
      createOficinaDto.area,
      { $push: { oficinas: savedOficina._id } },
      { new: true },
    );

    return savedOficina;
  }

  async findAll(): Promise<Oficina[]> {
    return this.oficinaModel
      .find()
      .populate('area')
      .populate('empleados')
      .exec();
  }

  async findOne(id: string): Promise<Oficina> {
    const r = await this.oficinaModel
      .findById(id)
      .populate('area')
      .populate('empleados')
      .exec();
    if (!r) throw new NotFoundException('Oficina no encontrada');
    return r;
  }

  async findByCode(codigo: string): Promise<Oficina | null> {
    return this.oficinaModel.findOne({ codigo }).exec();
  }

  async update(id: string, updateOficinaDto: UpdateSalonDto): Promise<Oficina> {
    const oficina = await this.oficinaModel.findById(id);
    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);

    if (
      updateOficinaDto.area &&
      oficina.area.toString() !== updateOficinaDto.area
    ) {
      await this.areaModel.findByIdAndUpdate(oficina.area, {
        $pull: { oficinas: oficina._id },
      });
      await this.areaModel.findByIdAndUpdate(updateOficinaDto.area, {
        $push: { oficinas: oficina._id },
      });
    }

    Object.assign(oficina, updateOficinaDto);
    return oficina.save();
  }

  async remove(id: string): Promise<Oficina> {
    const oficina = await this.oficinaModel.findByIdAndDelete(id);
    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);

    await this.areaModel.findByIdAndUpdate(oficina.area, {
      $pull: { oficinas: oficina._id },
    });
    return oficina;
  }
}
