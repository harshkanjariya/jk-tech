import {Test, TestingModule} from '@nestjs/testing';
import {PostsController} from './posts.controller';
import {PostsService} from './posts.service';
import {NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreatePostDto} from './posts.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockUser = {id: 1, name: 'John Doe'};
  const mockPost = {id: 1, title: 'Test Post', author: mockUser};

  const mockPostsService = {
    getPaginatedPosts: jest.fn().mockResolvedValue({posts: [mockPost], total: 1, currentPage: 1, totalPages: 1}),
    getPaginatedMyPosts: jest.fn().mockResolvedValue({posts: [mockPost], total: 1, currentPage: 1, totalPages: 1}),
    getPostById: jest.fn().mockImplementation((id) => id === 1 ? mockPost : null),
    createPost: jest.fn().mockResolvedValue(mockPost),
    updatePost: jest.fn().mockResolvedValue(mockPost),
    deletePost: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{provide: PostsService, useValue: mockPostsService}],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated posts', async () => {
    const result = await controller.getPosts();
    expect(result).toEqual({posts: [mockPost], total: 1, currentPage: 1, totalPages: 1});
  });

  it('should return paginated user posts', async () => {
    const result = await controller.getMyPosts({user: mockUser} as any);
    expect(result).toEqual({posts: [mockPost], total: 1, currentPage: 1, totalPages: 1});
  });

  it('should throw UnauthorizedException if user is not provided', async () => {
    mockPostsService.getPaginatedMyPosts.mockRejectedValue(new UnauthorizedException());
    await expect(controller.getMyPosts({} as any, 1, 10)).rejects.toThrow(UnauthorizedException);
  });

  it('should return a post by ID', async () => {
    const result = await controller.getPostById(1);
    expect(result).toEqual(mockPost);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    await expect(controller.getPostById(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = {title: 'New Post', content: 'content'};
    const result = await controller.createPost(createPostDto, {user: mockUser} as any);
    expect(result).toEqual(mockPost);
  });

  it('should update a post', async () => {
    const updateDto: CreatePostDto = {title: 'Updated Title', content: 'Updated content'};
    const result = await controller.updatePost(1, updateDto, {user: mockUser} as any);
    expect(result).toEqual(mockPost);
  });

  it('update a post not found error', async () => {
    const updateDto: CreatePostDto = {title: 'Updated Title', content: 'Updated content'};
    await expect(controller.updatePost(2, updateDto, {user: mockUser} as any))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if trying to update another user\'s post', async () => {
    await expect(controller.updatePost(1, {title: 'New Title', content: 'content'}, {user: {id: 2}} as any))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should delete a post', async () => {
    const result = await controller.deletePost(1, {user: mockUser} as any);
    expect(result).toEqual({message: 'Post deleted successfully'});
  });

  it('delete a post not found error', async () => {
    await expect(controller.deletePost(2, {user: mockUser} as any))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if trying to delete another user\'s post', async () => {
    await expect(controller.deletePost(1, {user: {id: 2}} as any))
      .rejects.toThrow(UnauthorizedException);
  });
});
