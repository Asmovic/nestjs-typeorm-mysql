import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../../typeorm/entities/Profile';
import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/User';
import { Post } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>){}

    findUsers() {
        return this.userRepository.find({ relations: ['profile', 'posts'] })
    }

    createUser(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ ...userDetails, createdAt: new Date() });

        return this.userRepository.save(newUser);
    }

    updateUser(id: number, updatedUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updatedUserDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    async createUserProfile(id: number, createUserProfileDetails: CreateUserProfileParams) {
        const user = await this.userRepository.findOneBy({ id })
        if(!user) throw new HttpException('User not found. Cannot create profile.', HttpStatus.BAD_REQUEST)
        const newProfile = this.profileRepository.create(createUserProfileDetails);
        const savedProfile = await this.profileRepository.save(newProfile);

        user.profile = savedProfile;
        return this.userRepository.save(user);
    }

    async createUserPost(id: number, createUserPostDetails: CreateUserPostParams) {
        const user = await this.userRepository.findOneBy({ id })
        if(!user) throw new HttpException('User not found. Cannot create profile.', HttpStatus.BAD_REQUEST)
        const newPost = this.postRepository.create({ ...createUserPostDetails, user });
        return await this.postRepository.save(newPost);

        /* user.posts.push(savedPost);
        return this.userRepository.save(user); */
    }
}
