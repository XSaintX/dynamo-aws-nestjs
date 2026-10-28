import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto, UpdateAlumnoDto } from './alumno.dto';

@ApiTags('alumnos')
@ApiSecurity('x-api-key')
@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly service: AlumnosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un alumno' })
  create(@Body() dto: CreateAlumnoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar alumnos o buscar por nombre, apellido o email' })
  @ApiQuery({ name: 'q', required: false, description: 'Texto a buscar' })
  findAll(@Query('q') q?: string) {
    return this.service.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alumno por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un alumno' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlumnoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un alumno' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}