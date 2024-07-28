import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateArticleCategoryDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Name Category',
    })
    name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Description Category',
    })
    description: string;
}
