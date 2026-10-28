import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosRepository } from './alumnos.repository';

describe('AlumnosService', () => {
  let service: AlumnosService;

  const repo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const ana = {
    alumnoId: '11111111-1111-4111-8111-111111111111',
    nombre: 'Ana',
    apellido: 'Pérez',
    email: 'ana@mail.com',
  };
  const luis = {
    alumnoId: '22222222-2222-4222-8222-222222222222',
    nombre: 'Luis',
    apellido: 'Gómez',
    email: 'luis@mail.com',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AlumnosService,
        { provide: AlumnosRepository, useValue: repo },
      ],
    }).compile();
    service = moduleRef.get(AlumnosService);
  });

  it('create: genera un alumnoId y guarda el alumno', async () => {
    repo.create.mockImplementation(async (a) => a);

    const result = await service.create({
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@mail.com',
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        alumnoId: expect.any(String),
        nombre: 'Ana',
      }),
    );
    expect(result.alumnoId).toBeDefined();
  });

  it('findAll: sin filtro devuelve todos', async () => {
    repo.findAll.mockResolvedValue([ana, luis]);
    expect(await service.findAll()).toHaveLength(2);
  });

  it('findAll: filtra por texto sin importar mayúsculas ni tildes', async () => {
    repo.findAll.mockResolvedValue([ana, luis]);

    const result = await service.findAll('GOMEZ');

    expect(result).toEqual([luis]);
  });

  it('findOne: devuelve el alumno si existe', async () => {
    repo.findOne.mockResolvedValue(ana);
    expect(await service.findOne(ana.alumnoId)).toEqual(ana);
  });

  it('findOne: lanza NotFoundException si no existe', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
  });

  it('update: devuelve el alumno actualizado', async () => {
    repo.update.mockResolvedValue({ ...ana, nombre: 'Anita' });

    const result = await service.update(ana.alumnoId, { nombre: 'Anita' });

    expect(result.nombre).toBe('Anita');
  });

  it('update: lanza NotFoundException si no existe', async () => {
    repo.update.mockResolvedValue(undefined);
    await expect(service.update('x', { nombre: 'Z' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove: lanza NotFoundException si no existe', async () => {
    repo.remove.mockResolvedValue(false);
    await expect(service.remove('x')).rejects.toThrow(NotFoundException);
  });

  it('remove: no lanza error si se elimina', async () => {
    repo.remove.mockResolvedValue(true);
    await expect(service.remove(ana.alumnoId)).resolves.not.toThrow();
  });
});