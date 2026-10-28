import { Test } from '@nestjs/testing';
import { AlumnosController } from './alumnos.controller';
import { AlumnosService } from './alumnos.service';

describe('AlumnosController', () => {
  let controller: AlumnosController;

  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [AlumnosController],
      providers: [{ provide: AlumnosService, useValue: service }],
    }).compile();
    controller = moduleRef.get(AlumnosController);
  });

  it('create: delega en el servicio', async () => {
    const dto = { nombre: 'Ana', apellido: 'Pérez', email: 'ana@mail.com' };
    service.create.mockResolvedValue({ alumnoId: 'abc', ...dto });

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.alumnoId).toBe('abc');
  });

  it('findAll: pasa el parámetro q al servicio', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll('ana');

    expect(service.findAll).toHaveBeenCalledWith('ana');
  });

  it('findOne: delega en el servicio', async () => {
    service.findOne.mockResolvedValue({ alumnoId: 'abc' });

    await controller.findOne('abc');

    expect(service.findOne).toHaveBeenCalledWith('abc');
  });

  it('update: delega en el servicio', async () => {
    service.update.mockResolvedValue({ alumnoId: 'abc' });

    await controller.update('abc', { nombre: 'Z' });

    expect(service.update).toHaveBeenCalledWith('abc', { nombre: 'Z' });
  });

  it('remove: delega en el servicio', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove('abc');

    expect(service.remove).toHaveBeenCalledWith('abc');
  });
});