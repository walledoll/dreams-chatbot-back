import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsPhoneNumber('RU')
    phone: string;

    @IsNotEmpty()
    @Length(8)
    pass: string;

    @IsNotEmpty()
    @Length(2)
    name: string;

    @Type(() => Date)
    @IsDate()
    birthDate: string;
}
