import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

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

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload Article Image File (jpg, jpeg, png)',
        default: 'File Article Image'
    })
    upload_image?: any;

    @ApiProperty({
        enum: [true, false],
        description: 'Publish Article',
        default: false
    })

    published: boolean;
}
