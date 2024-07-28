import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ArticleCommentsService {
  constructor(private prisma: PrismaService) { }

  async postComment(user: any, article_id: string, createArticleCommentDto: CreateArticleCommentDto) {
    //Find User
    const getUser = await this.prisma.users.findUnique({
      where: { user_id: user.user_id }
    });

    //Check Article
    const existingArticle = await this.prisma.articles.findUnique({
      where:
        { article_id: article_id }
    });

    if (!existingArticle) {
      throw new ConflictException('Article not found');
    }

    try {
      const { comment } = createArticleCommentDto;
      const newComment = await this.prisma.article_comments.create({
        data: {
          comment,
          user: {
            connect: {
              user_id: getUser.user_id
            }
          },
          article: {
            connect: {
              article_id: existingArticle.article_id
            }
          }
        }

      });
      return {
        status: "success",
        message: 'Comment created successfully',
        data: newComment
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create Comment');
    }
  }

  async getComments(article_id: string) {
    const comments = await this.prisma.article_comments.findMany({
      where: {
        article_id
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            user_profiles: {
              select: {
                first_name: true,
                last_name: true,
                profile_image_path: true
              }
            }
          }
        }
      }
    });

    return {
      status: "success",
      message: 'Comments retrieved successfully',
      data: comments
    };
  }

  async updateComment(user: any, article_comment_id: string, updateArticleCommentDto: UpdateArticleCommentDto) {
    //Find User
    const getUser = await this.prisma.users.findUnique({
      where: { user_id: user.user_id }
    });

    //Check Comment
    const existingComment = await this.prisma.article_comments.findUnique({
      where:
        { article_comment_id, user_id: getUser.user_id }
    });

    if (!existingComment) {
      throw new ConflictException('Comment not found');
    }

    try {
      const { comment } = updateArticleCommentDto;
      const updatedComment = await this.prisma.article_comments.update({
        where: {
          article_comment_id,
          user_id: getUser.user_id
        },
        data: {
          comment,
          user: {
            connect: {
              user_id: getUser.user_id
            }
          }
        }
      });
      return {
        status: "success",
        message: 'Comment updated successfully',
        data: updatedComment
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to update Comment');
    }
  }

  async deleteComment(user: any, article_comment_id: string) {
    //Find User
    const getUser = await this.prisma.users.findUnique({
      where: { user_id: user.user_id }
    });

    //Check Comment
    const existingComment = await this.prisma.article_comments.findUnique({
      where:
        { article_comment_id, user_id: getUser.user_id }
    });

    if (!existingComment) {
      throw new ConflictException('Comment not found');
    }

    try {
      await this.prisma.article_comments.delete({
        where: {
          article_comment_id,
          user_id: getUser.user_id
        }
      });
      return {
        status: "success",
        message: 'Comment deleted successfully'
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to delete Comment');
    }
  }
}
