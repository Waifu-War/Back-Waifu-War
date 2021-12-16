import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WaifuService } from "src/waifu/waifu.service";
import { Repository } from "typeorm";
import { UserDto } from "./user.DTO";
import { User } from "./user.entity";

@Injectable()
export class UserService {

    //Liste des champs obligatoires pour la création de l'utilisateur
    mandatoryKeys: Array<string> = ["userName", "tag", "grade"];
    //Liste des champs autorisés
    possibleKeys: Array<string> = ["userName", "tag", "grade", "startDate", "nbWaifuCreated"]

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => WaifuService)) private readonly waifuService: WaifuService
    ) {}

    /*
    ** Permet d'avoir tout les utilisateurs
    ** Retour :
    **  - Array[UserDto] contenant les users existants
    */
    async getAllUser() {
        return (await this.userRepository.find());
    }

    /*
    ** Permet d'obtenir un user via son id
    ** Sécurité:
    **  - Vérification que l'id soit bien un nombre
    ** Retour:
    **  - UserDto si l'user existe
    **  - undefined si jamais un problème existe
    */
    async getUserById(id: number) {
        //Vérification que l'id soit un int
        if (isNaN(id)) {
            return (undefined);
        }
        return (await this.userRepository.findOne(id));
    }

    /*
    ** Route permettant d'avoir un user via son tag
    ** Paramètre:
    **  - tag: tag de l'user dont on veux chercher
    ** Retour:
    **  - UserDto si jamais l'utilisateur existe
    **  - undefined si jamais l'utilisateur n'existe pas
    */
    async getUserByTag(tag: string) {
        return (await this.userRepository.findOne({
            where: {
                tag: tag
            }
        }));
    }

    /*
    ** Permet de créer un utilisateur
    ** Sécurité:
    **  - Vérification des champs obligatoires
    **  - Suppression des champs inutiles
    **  - Vérification que le tag n'est pas dupliqué
    ** Retour:
    **  - true si jamais l'user est créer
    **  - false si jamais l'user n'est pas créer
    */
    async createUser(userDto: UserDto) {
        //Vérification des champs obligatoires
        for (let key in this.mandatoryKeys) {
            if (!Object.keys(userDto).includes(this.mandatoryKeys[key])) {
                return (false);
            }
        }
        //Suppression des champs inutiles
        for (let key in Object.keys(userDto)) {
            if (!this.possibleKeys.includes(Object.keys(userDto)[key])) {
                delete userDto[Object.keys(userDto)[key]];
            }
        }
        //Suppression que le tag n'est pas dupliqué$
        if (await this.getUserByTag(userDto.tag) != undefined) {
            return (false);
        }
        //Création de l'user en db
        return (await this.userRepository.save(userDto));
    }

    /*
    ** Permet de modifier un utilisateur selon son id
    ** Paramètres:
    **  - id : id de l'utilisateur a modifier
    **  - userDto : données de l'utilisateur a modifier
    ** Sécurité:
    **  - Vérification que l'id soit un nombre
    **  - Vérification que l'id soit associé a un user
    **  - Suppression des champs inutiles
    ** Retour:
    **  - false si jamais un problème a lieux
    **  - true si jamais tout se passe bien
    */
    async putUserById(id: number, userDto: UserDto) {
        //Vérification que l'id soit un nombre
        if (isNaN(id)) {
            return (false);
        }
        //Vérification que l'id soit associé a un user
        if (await this.getUserById(id) == undefined) {
            return (false);
        }
        //Suppression des champs inutiles
        for (let key in Object.keys(userDto)) {
            if (!this.possibleKeys.includes(Object.keys(userDto)[key])) {
                delete userDto[Object.keys(userDto)[key]];
            }
        }
        await this.userRepository.update(id, userDto);
        return (true);
    }

    /*
    ** Suppression d'un utilisateur via son id, supprime aussi tout les champs créateur
    ** dans les waifus
    ** Paramètres:
    **  - id : id associé a l'user
    ** Sécurité:
    **  - Vérification que l'id soit bien un nombre
    **  - Vérification que l'id soit associé a un user
    ** Retour:
    **  - false si jamais un problème est détecté
    **  - true si jamais l'user est détruit
    */
    async deleteUserById(id: number) {
        //Vérification que l'id soit un nombre
        if (isNaN(id)) {
            return (false);
        }
        //Vérification que l'id est associé a un user
        let user = await this.getUserById(id);
        if (user == undefined) {
            return (false);
        }
        //Suppression de l'user
        await this.userRepository.delete(id);
        //Supression des champs associés
        await this.waifuService.deleteWaifuTag(user.tag);
        return (true);
    }

    /*
    ** Méthode permettant d'obtenir le nombre de waifu créer par un utilisateur via son tag
    ** Paramètres :
    **  - tag: tag de l'user dont on veux la limite
    ** Sécurité:
    **  - Vérification que le tag est bien associé à un user
    ** Retour:
    **  - -1 si un problème est présent
    **  - le nombre de waifu créer par le user
    */
    async getUserWaifuNb(tag: string) {
        //Vérification de l'existence de l'user
        let user: UserDto = await this.getUserByTag(tag);
        if (user == undefined) {
            return (-1);
        }
        //Get waifu list by tag
        return (await this.waifuService.getAllWaifuByTag(tag));
    }

}