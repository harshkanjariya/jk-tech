import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import {CreatePostDto} from "./posts.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return await this.postsRepository.find({ relations: ['author'] });
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(newPost);
  }
}
