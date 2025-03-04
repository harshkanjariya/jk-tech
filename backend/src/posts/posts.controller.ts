import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import {CreatePostDto} from "./posts.dto";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts() {
    return await this.postsService.getAllPosts();
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.createPost(createPostDto);
  }
}
