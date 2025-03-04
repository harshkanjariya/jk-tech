import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from './post.entity';
import {CreatePostDto} from "./posts.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {
  }

  async getPostById(id: number): Promise<Post | null> {
    return await this.postsRepository.findOne({
      where: {id},
      relations: ['author'],
    });
  }

  async getPaginatedPosts(page: number, limit: number) {
    const [posts, total] = await this.postsRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['author'],
      order: {createdAt: 'DESC'},
      select: ['author', 'title', 'createdAt', 'id']
    });

    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPaginatedMyPosts(page: number, limit: number, user: any) {
    if (!user?.id) {
      throw new UnauthorizedException();
    }

    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.createdAt',
        'author.name'
      ])
      .where('author.id = :userId', { userId: user.id })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();


    return {
      posts,
    };
  }

  async createPost(createPostDto: CreatePostDto, user: any): Promise<Post> {
    const newPost = this.postsRepository.create({...createPostDto, author: user});
    return await this.postsRepository.save(newPost);
  }

  async updatePost(id: number, createPostDto: CreatePostDto): Promise<Post> {
    await this.postsRepository.update(id, createPostDto);
    return this.getPostById(id);
  }

  async deletePost(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
