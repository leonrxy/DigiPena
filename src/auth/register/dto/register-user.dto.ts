import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Leonardus',
    })
    first_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Reka',
    })
    last_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'userdigipena',
    })
    username: string;

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'user@mail.com',
    })
    email: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'user12345',
    })
    password: string;
}
