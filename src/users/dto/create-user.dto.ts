import { IsDate, IsPhoneNumber, Length } from "class-validator";

export class CreateUserDto {
    @IsPhoneNumber('RU')
    phone: string;

    @Length(8)
    pass: string;

    @Length(2)
    name: string;

    @IsDate()
    birthDate: string;
}
