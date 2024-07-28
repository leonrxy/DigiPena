import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArticleCommentDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Article Title',
    })
    comment: string;
}
