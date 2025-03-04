import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  NotFoundException,
  Param,
  UnauthorizedException,
  Patch, Delete
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {CreatePostDto} from "./posts.dto";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return await this.postsService.getPaginatedPosts(+page, +limit);
  }

  @Get("/my")
  async getMyPosts(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getPaginatedMyPosts(+page, +limit, req['user']);
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    const post = await this.postsService.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return await this.postsService.createPost(createPostDto, req['user']);
  }

  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req['user']; // Extract logged-in user

    const post = await this.postsService.getPostById(id);
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }

    if (post.author.id !== user.id) {
      throw new UnauthorizedException('You are not allowed to edit this post');
    }

    return await this.postsService.updatePost(id, createPostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number, @Req() req: Request) {
    const user = req['user'];
    const post = await this.postsService.getPostById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== user.id) {
      throw new UnauthorizedException('You are not allowed to delete this post');
    }

    await this.postsService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }
}
