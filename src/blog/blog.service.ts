/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlogService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  AWS_S3_BUCKET = 'eatse';

  async create(
    /* filename: string,
    filetype: string,
    file: Buffer, */
    createBlogDto: CreateBlogDto,
  ) {
    /* const key = filename + Date.now();
    let fileURL: PutObjectCommandOutput;
    try {
      fileURL = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.AWS_S3_BUCKET,
          Key: key,
          Body: file,
          ACL: 'public-read',
          ContentType: filetype,
        }),
      );
    } catch (err) {
      console.log(err);
      return err;
    } */
    const new_post = await this.blogModel.create(createBlogDto);
    return new_post.id;
  }

  async uploadImage(filename: string, filetype: string, file: Buffer) {
    const key = filename + Date.now();
    let fileURL: PutObjectCommandOutput;
    try {
      fileURL = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.AWS_S3_BUCKET,
          Key: key,
          Body: file,
          ACL: 'public-read',
          ContentType: filetype,
        }),
      );
    } catch (err) {
      console.log(err);
      return err;
    }

    if (fileURL.$metadata.httpStatusCode !== 200) {
      throw new HttpException(
        'FILE WAS NOT SAVED TO BUCKET!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return {
      id: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
    };
  }

  async findAll(query?: any) {
    const blogs = await this.blogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(query ? query.limit : 0);
    return blogs;
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {
      new: true,
      upsert: true,
    });
    return blog.id;
  }

  async remove(id: string) {
    return await this.blogModel.findByIdAndDelete(id);
  }
}
