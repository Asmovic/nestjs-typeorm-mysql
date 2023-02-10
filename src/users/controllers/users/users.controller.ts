import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from '../../dtos/createUser.dto';
import { UpdateUserDto } from '../../dtos/updateUser.dto';
import { CreateUserProfileDto } from '../../dtos/createUserProfile.dto';
import { CreateUserPostDto } from 'src/users/dtos/createUserPost.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {

    }
    @Get()
    getUsers() {
        return this.userService.findUsers();
    }
  
    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
 
    @Patch(':id')
    async updateUserById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        await this.userService.updateUser(id, updateUserDto)
    }

    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.userService.deleteUser(id)
    }

    @Post(':id/profiles')
    createUserProfile(@Param('id', ParseIntPipe) id: number, @Body() createUserProfileDto: CreateUserProfileDto) {
        return this.userService.createUserProfile(id, createUserProfileDto)
    }

    @Post(':id/posts')
    createUserPost(@Param('id', ParseIntPipe) id: number, @Body() createUserPostDto: CreateUserPostDto) {
        return this.userService.createUserPost(id, createUserPostDto)
    }
}
