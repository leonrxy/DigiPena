import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'First Name',
    })
    first_name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        description: 'This is a required property',
        default: 'Last Name',
    })
    last_name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        description: 'This is a required property',
        default: 'Tech enthusiast and blogger.',
    })
    bio: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Upload Profile Image File (jpg, jpeg, png)',
        default: 'File Profile Image'
    })
    profile_image: any;

    @IsOptional()
    @IsUrl()
    @ApiProperty({
        type: String,
        required: false,
        description: 'This is a required property',
        default: 'https://example.com',
    })
    website_url: string;
}
