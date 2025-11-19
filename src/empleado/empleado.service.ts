import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empleado, TipoEmpleado } from 'src/entities/empleado.schema';
import { Model } from 'mongoose';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Area } from 'src/entities/area.schema';
import { Oficina } from 'src/entities/oficina.schema';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectModel(Empleado.name) private empleadoModel: Model<Empleado>,
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(Oficina.name) private oficinaModel: Model<Oficina>,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const existing = await this.empleadoModel.findOne({
      documento: createEmpleadoDto.documento,
    });
    if (existing) {
      throw new ConflictException(
        `El documento ${createEmpleadoDto.documento} ya está registrado`,
      );
    }

    if (
      createEmpleadoDto.tipoEmpleado !== TipoEmpleado.PROFESOR &&
      createEmpleadoDto.tipoEmpleado !== TipoEmpleado.ADMINISTRATIVO
    ) {
      throw new BadRequestException('Tipo de empleado no válido');
    }

    if (
      createEmpleadoDto.tipoEmpleado === TipoEmpleado.PROFESOR &&
      !createEmpleadoDto.tipoProfesor
    ) {
      throw new BadRequestException(
        'Debe especificar el tipoProfesor cuando el empleado es PROFESOR',
      );
    }

    const empleado = new this.empleadoModel(createEmpleadoDto);
    const savedEmpleado = await empleado.save();

    if (createEmpleadoDto.area) {
      await this.areaModel.findByIdAndUpdate(
        createEmpleadoDto.area,
        { $push: { empleados: savedEmpleado._id } },
        { new: true },
      );
    }

    if (createEmpleadoDto.oficina) {
      await this.oficinaModel.findByIdAndUpdate(
        createEmpleadoDto.oficina,
        { $push: { empleados: savedEmpleado._id } },
        { new: true },
      );
    }

    return savedEmpleado;
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadoModel
      .find()
      .populate('area')
      .populate('oficina')
      .exec();
  }

  async findOne(id: string): Promise<Empleado> {
    const empleado = await this.empleadoModel
      .findById(id)
      .populate('area')
      .populate('oficina')
      .exec();

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id} no encontrado`);
    }
    return empleado;
  }

  async update(
    id: string,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<Empleado> {
    const empleado = await this.empleadoModel.findById(id);
    if (!empleado)
      throw new NotFoundException(`Empleado con id ${id} no encontrado`);

    // Si cambia de área actualizo referencia
    if (
      updateEmpleadoDto.area &&
      empleado.area?.toString() !== updateEmpleadoDto.area
    ) {
      await this.areaModel.findByIdAndUpdate(empleado.area, {
        $pull: { empleados: empleado._id },
      });
      await this.areaModel.findByIdAndUpdate(updateEmpleadoDto.area, {
        $push: { empleados: empleado._id },
      });
    }

    // Si cambia de oficina actualizo referencia
    if (
      updateEmpleadoDto.oficina &&
      empleado.oficina?.toString() !== updateEmpleadoDto.oficina
    ) {
      await this.oficinaModel.findByIdAndUpdate(empleado.oficina, {
        $pull: { empleados: empleado._id },
      });
      await this.oficinaModel.findByIdAndUpdate(updateEmpleadoDto.oficina, {
        $push: { empleados: empleado._id },
      });
    }

    Object.assign(empleado, updateEmpleadoDto);
    return empleado.save();
  }

  async remove(id: string): Promise<Empleado> {
    const empleado = await this.empleadoModel.findByIdAndDelete(id);
    if (!empleado)
      throw new NotFoundException(`Empleado con id ${id} no encontrado`);

    if (empleado.area) {
      await this.areaModel.findByIdAndUpdate(empleado.area, {
        $pull: { empleados: empleado._id },
      });
    }

    if (empleado.oficina) {
      await this.oficinaModel.findByIdAndUpdate(empleado.oficina, {
        $pull: { empleados: empleado._id },
      });
    }

    return empleado;
  }
}
