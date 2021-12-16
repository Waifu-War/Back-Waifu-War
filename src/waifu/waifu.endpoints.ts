import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { WaifuDto } from './waifu.DTO';
import { WaifuService } from './waifu.service';

@Controller("waifu")
export class WaifuController {
    constructor(private readonly waifuService: WaifuService) {}

    @Get()
    async getAllWaifu(@Res() response) {
        let waifuList = await this.waifuService.getAllWaifu();

        return (response.status(200).send(waifuList));
    }

    @Post()
    async createWaifu(@Body() waifuDto: WaifuDto, @Res() response) {
        //Creation de la waifu
        this.waifuService.createWaifu(waifuDto).then(
            (res) => {
                if (!res) {
                    //Mauvaise donnée présente
                    return (response.status(203).send("Not authorized"));
                }
                //Tout s'est bien passé
                return (response.status(201).send("Waifu created"));
            },
            (_) => {
                //Erreur du serveur
                return (response.status(500).send("Internal server error"));
            }
        );
    }

    @Delete(":id")
    async deleteWaifu(@Param("id") id: number, @Res() response) {
        //Deletion de la waifu
        this.waifuService.deleteWaifu(id).then(
            (res) => {
                if (res == false) {
                    //Erreur dans la requète ou bien non existance de l'id
                    return (response.status(203).send("Not authorized"));
                }
                //Tout s'est bien passé
                return (response.status(200).send("Deleted"));
            },
            (_) => {
                //Crash innatendu
                return (response.status(500).send("Internal server error"));
            }
        );
    }

    @Get(":id")
    async getWaifuById(@Param("id") id: number, @Res() response) {
        let waifu = await this.waifuService.getWaifuById(id);

        if (waifu == undefined) {
            //Si jamais la waifu n'existe pas
            return (response.status(203).send("not authorized"))
        }
        //Si jamais la waifu existe
        return (response.status(200).send(waifu));
    }

    @Put(":id")
    async putWaifuById(@Body() waifuDto: WaifuDto, @Param("id") id: number, @Res() response) {
        let result = await this.waifuService.putWaifuById(id, waifuDto);

        if (result == false) {
            //la waifu n'existe pas
            return (response.status(203).send("Not authorized"));
        }
        //Tout jamais s'est passé
        return (response.status(200).send("Waifu updated"));
    }

}
