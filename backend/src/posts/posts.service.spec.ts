import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './posts.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: Repository<Post>;

  const mockPostsRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostsRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const post = { id: 1, title: 'Test Post', author: { id: 1, name: 'User' } };
      mockPostsRepository.findOne.mockResolvedValue(post);

      const result = await service.getPostById(1);
      expect(result).toEqual(post);
      expect(mockPostsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author'],
      });
    });

    it('should return null if post not found', async () => {
      mockPostsRepository.findOne.mockResolvedValue(null);
      const result = await service.getPostById(999);
      expect(result).toBeNull();
    });
  });

  describe('getPaginatedPosts', () => {
    it('should return paginated posts', async () => {
      const posts = [{ id: 1, title: 'Post 1', createdAt: new Date(), author: { id: 1, name: 'User' } }];
      mockPostsRepository.findAndCount.mockResolvedValue([posts, 1]);

      const result = await service.getPaginatedPosts(1, 10);
      expect(result).toEqual({
        posts,
        total: 1,
        currentPage: 1,
        totalPages: 1,
      });
      expect(mockPostsRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        relations: ['author'],
        order: { createdAt: 'DESC' },
        select: ['author', 'title', 'createdAt', 'id'],
      });
    });
  });

  describe('getPaginatedMyPosts', () => {
    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.getPaginatedMyPosts(1, 10, null)).rejects.toThrow(UnauthorizedException);
    });

    it('should return paginated posts for a specific user', async () => {
      const posts = [{ id: 1, title: 'User Post', createdAt: new Date(), author: { id: 2, name: 'User' } }];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      };

      mockPostsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getPaginatedMyPosts(1, 10, { id: 2 });

      expect(result).toEqual({ posts });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('author.id = :userId', { userId: 2 });
    });
  });

  describe('createPost', () => {
    it('should create and return a new post', async () => {
      const createPostDto: CreatePostDto = { title: 'New Post', content: 'content' };
      const user = { id: 1, name: 'User' };
      const newPost = { id: 1, ...createPostDto, author: user };

      mockPostsRepository.create.mockReturnValue(newPost);
      mockPostsRepository.save.mockResolvedValue(newPost);

      const result = await service.createPost(createPostDto, user);

      expect(result).toEqual(newPost);
      expect(mockPostsRepository.create).toHaveBeenCalledWith({ ...createPostDto, author: user });
      expect(mockPostsRepository.save).toHaveBeenCalledWith(newPost);
    });
  });

  describe('updatePost', () => {
    it('should update and return the updated post', async () => {
      const updatedPost = { id: 1, title: 'Updated Title', createdAt: new Date() };

      mockPostsRepository.update.mockResolvedValue(null);
      mockPostsRepository.findOne.mockResolvedValue(updatedPost);

      const result = await service.updatePost(1, { title: 'Updated Title', content: 'content' });

      expect(result).toEqual(updatedPost);
      expect(mockPostsRepository.update).toHaveBeenCalledWith(1, { title: 'Updated Title', content: 'content' });
      expect(mockPostsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['author'] });
    });
  });

  describe('deletePost', () => {
    it('should delete a post by ID', async () => {
      mockPostsRepository.delete.mockResolvedValue(null);
      await service.deletePost(1);
      expect(mockPostsRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
