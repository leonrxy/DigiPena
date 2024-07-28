import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class VerifyOTPDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'user@mail.com',
    })
    email: string;

    @IsString()
    @Length(4)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: '1234',
    })
    otp: string;
}
