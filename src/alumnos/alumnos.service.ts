import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Alumno, AlumnosRepository } from './alumnos.repository';
import { CreateAlumnoDto, UpdateAlumnoDto } from './alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(private readonly repo: AlumnosRepository) {}

  create(dto: CreateAlumnoDto): Promise<Alumno> {
    return this.repo.create({ alumnoId: randomUUID(), ...dto });
  }

  async findAll(q?: string): Promise<Alumno[]> {
    const alumnos = await this.repo.findAll();
    if (!q?.trim()) return alumnos;

    const termino = normalizar(q);
    return alumnos.filter((a) =>
      normalizar(`${a.nombre} ${a.apellido} ${a.email}`).includes(termino),
    );
  }

  async findOne(alumnoId: string): Promise<Alumno> {
    const alumno = await this.repo.findOne(alumnoId);
    if (!alumno) throw this.notFound(alumnoId);
    return alumno;
  }

  async update(alumnoId: string, dto: UpdateAlumnoDto): Promise<Alumno> {
    const alumno = await this.repo.update(alumnoId, dto);
    if (!alumno) throw this.notFound(alumnoId);
    return alumno;
  }

  async remove(alumnoId: string): Promise<void> {
    const removed = await this.repo.remove(alumnoId);
    if (!removed) throw this.notFound(alumnoId);
  }

  private notFound(alumnoId: string): NotFoundException {
    return new NotFoundException(`Alumno con id ${alumnoId} no encontrado`);
  }
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}