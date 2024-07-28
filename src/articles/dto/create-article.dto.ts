import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Article Title',
    })
    title: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Article Content',
    })
    content: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Article Category Name',
    })
    category_name: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Upload Article Image File (jpg, jpeg, png)',
        default: 'File Article Image'
    })
    article_image?: any;

    @ApiProperty({
        enum: [true, false],
        description: 'Publish Article',
        default: false
    })

    published: boolean;
}
