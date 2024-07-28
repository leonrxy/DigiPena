import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'user1@mail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'user12345',
    })
    password: string;
}
