import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateRoleRequestDto, UpdateRoleRequestDto } from './role.dto';

@Controller('role')
export class RoleController {
  @Get()
  getAllRoles(@Query('page') page = 1, @Query('limit') limit = 10) {
    return `This action returns all roles. Limit ${limit}, page: ${page}`;
  }

  @Get(':id')
  getRoleById(@Param('id') id: string): string {
    return `This action returns a #${id} role`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRole(@Body() createRoleDto: CreateRoleRequestDto): string {
    return `This action adds a new role ${createRoleDto.role}`;
  }

  @Put(':id')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleRequestDto,
  ) {
    return `This action updates the role ${updateRoleDto.role} with #${id}`;
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return `This action removes the role with id #${id}`;
  }
}
