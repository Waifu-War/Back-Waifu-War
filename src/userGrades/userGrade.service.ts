import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserGradeDTO } from "./userGrade.DTO";
import { UserGrade } from "./userGrade.entity";

@Injectable()
export class UserGradeService {

    //Liste des champs obligatoires
    mandatoryKeys: Array<string> = ["name", "nbWaifuCreate"]
    //Liste des champs autorisés
    possibleKeys: Array<string> = ["name", "nbWaifuCreate"]

    constructor(
        @InjectRepository(UserGrade) private readonly userGradeRepository: Repository<UserGrade>
    ) {}

    /*
    ** Route permettant de créer un grade
    ** Paramètres:
    **  - userGradeDto: grade à ajouter
    ** Sécurité:
    **  - Vérification des champs obligatoires
    **  - Suppression des champs inutiles
    **  - Vérification que userGradeDto.nbWaifuCreate soit un int
    ** Retour:
    **  - false: si jamais un problème existe
    **  - true: si jamais le grade est créer
    */
    async createGrade(userGradeDto: UserGradeDTO) {
        //Vérification des champs obligatoires
        for (let key in this.mandatoryKeys) {
            if (!Object.keys(userGradeDto).includes(this.mandatoryKeys[key])) {
                return (false);
            }
        }
        //Suppression des clés inutiles
        for (let key in Object.keys(userGradeDto)) {
            if (!this.possibleKeys.includes(key)) {
                delete userGradeDto[key];
            }
        }
        //Vérification que l'userGradeDto.nbWaifuCreate soit bien un nombre
        if (isNaN(userGradeDto.nbWaifuCreate)) {
            return (false);
        }
        //Création du grade dans la db
        await this.userGradeRepository.save(userGradeDto);
        return (true);
    }

    /*
    ** Route permettant de get tout les grades existant
    ** Retour:
    **  - Array<UserGradeDto>: list de tout les grades
    */
    async getAllGrades() {
        return (await this.userGradeRepository.find());
    }

    /*
    ** Route permettant de get son grade via le nom
    */
    async getGradeByName(name: string) {
        return (await this.userGradeRepository.findOne({
            where: {
                name: name
            }
        }));
    }

    /*
    ** Route permettant de delete un user via son nom
    ** Paramètres:
    **  - name: nom du grade a delete
    ** Sécurité:
    **  - Vérification de l'existence du grade
    ** Retour:
    **  - false: si jamais un problème existe
    **  - true: si le grade est deleted
    */
    async deleteUserGradeByaName(name: string) {
        //Vérification de l'existence du grade
        let userGrade = await this.getGradeByName(name);
        if (userGrade == undefined) {
            return (false);
        }
        //Suppression en db
        await this.userGradeRepository.delete({
            name: name
        });
        return (true);
    }

    /*
    ** Route permettant d'update un grade via son nom
    ** Paramètres:
    **  - name: nom du grade a update
    **  - userGradeDto: infos a update
    ** Sécurité:
    **  - Suppression des champs inutiles
    **  - Vérification de l'existance du grade
    ** Retour:
    **  - true si tout se passe bien
    **  - false si jamais un problème existe
    */
    async updateUserGradeByName(name: string, userGradeDto: UserGradeDTO) {
        //Suppression des champs inutiles
        for (let key in Object.keys(userGradeDto)) {
            if (!this.possibleKeys.includes(key)) {
                delete userGradeDto[key];
            }
        }
        //Vérification de l'existence du grade
        let userGrade = await this.getGradeByName(name);
        if (userGrade == undefined) {
            return (false);
        }
        //Update du grade dans la db
        await this.userGradeRepository.update({
            name: name
        }, userGradeDto);
    }

}