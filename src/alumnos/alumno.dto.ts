import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAlumnoDto {
  @ApiProperty({ example: 'XSaint' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({ example: 'Light' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido!: string;

  @ApiProperty({ example: 'xsaint@gmail.com' })
  @IsEmail()
  @MaxLength(150)
  email!: string;
}

export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto) {}