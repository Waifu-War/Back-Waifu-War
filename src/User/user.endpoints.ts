import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { UserDto } from "./user.DTO";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUser(@Res() response) {
        let userList = await this.userService.getAllUser();

        return (response.status(200).send(userList));
    }

    @Post()
    async postuser(@Body() userDto: UserDto, @Res() response) {
        //Création de l'user
        let result = await this.userService.createUser(userDto);

        if (result == false) {
            //Si jamais l'user n'est pas créer
            return (response.status(203).send("Not authorized"));
        }
        //Si jamais l'user est créer
        return (response.status(200).send("User created"));
    }

    @Get(":id")
    async getUserById(@Param("id") id: number, @Res() response) {
        let user = await this.userService.getUserById(id);

        if (user == undefined) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send(user));
    }

    @Put(":id")
    async putUserById(@Body() userDto: UserDto, @Param("id") id: number, @Res() response) {
        let user = await this.userService.putUserById(id, userDto);

        if (user == false) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send("User changed"));
    }

    @Delete(":id")
    async deleteUserById(@Param("id") id: number, @Res() response) {
        let result = await this.userService.deleteUserById(id);

        if (result == false) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send("User deleted"));
    }

    @Get("/tag/:tag")
    async getUserByTag(@Param("tag") tag: string, @Res() response) {
        let user = await this.userService.getUserByTag(tag);

        if (user == undefined) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send(user));
    }

}