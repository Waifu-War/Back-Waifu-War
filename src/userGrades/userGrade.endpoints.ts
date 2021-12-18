import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { UserGradeDTO } from "./userGrade.DTO";
import { UserGradeService } from "./userGrade.service";

@Controller("userGrade")
export class UserGradeController {

    constructor (private readonly userGradeService: UserGradeService) {}

    @Post()
    async postUserGrade(@Body() body: UserGradeDTO, @Res() response) {
        let result = await this.userGradeService.createGrade(body);

        if (result == false) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send("userGrade created"));
    }

    @Get()
    async getAllGrades(@Res() response) {
        let allUserGrades = await this.userGradeService.getAllGrades();

        return (response.status(200).send(allUserGrades));
    }

    @Get(":name")
    async getGradeByName(@Param("name") name: string, @Res() response) {
        let userGrade = await this.userGradeService.getGradeByName(name);

        return (response.status(200).send(userGrade));
    }

    @Delete(":name")
    async deleteGradeByName(@Param("name") name: string, @Res() response) {
        let result = await this.userGradeService.deleteUserGradeByaName(name);

        if (result == false) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send("Deleted"));
    }

    @Put(":name")
    async updateGradeByName(@Body() body: UserGradeDTO, @Param("name") name: string, @Res() response) {
        let result = await this.userGradeService.updateUserGradeByName(name, body);

        if (result == false) {
            return (response.status(203).send("Not authorized"));
        }
        return (response.status(200).send("Updated"));
    }

}