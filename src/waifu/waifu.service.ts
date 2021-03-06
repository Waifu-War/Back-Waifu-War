import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/User/user.service';
import { UserGradeDTO } from 'src/userGrades/userGrade.DTO';
import { UserGradeService } from 'src/userGrades/userGrade.service';
import { Repository } from 'typeorm';
import { WaifuDto } from './waifu.DTO';
import { Waifu } from './waifu.entity';

@Injectable()
export class WaifuService {

    constructor(
        @InjectRepository(Waifu) private readonly waifuRepository: Repository<Waifu>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        @Inject(forwardRef(() => UserGradeService)) private readonly userGradeService: UserGradeService
    ) {}

    //Voici une liste des champs qui sont obligatoire pour la création d'une waifu
    mandatoryKeys: Array<string> = ["nickname", "firstname", "lastname", "age", "img", "manga", "firstIdea"];
    //Voici une liste des champs autorisés
    possibleKeys: Array<string> = ["nickname", "lastname", "firstname", "age", "img", "manga", "gradeAverage", "nbLikes", "leaderboard", "firstIdea", "atk", "life", "def", "speed", "mana", "luck", "points"]

    /*
    ** Méthode de création de waifu, permet de vérifier toutes les informations et
    ** de vérifier la sécurité des informations.
    ** Paramètre:
    **  - waifuDto paramètres envoyé dans la requète
    ** Sécurité:
    **  - Vérification de la présence des champs de this.mandatoryKeys
    **  - Suppression des champs qui ne sont pas présents dans l'object
    **  - Vérification que le champs age est un nombre  
    **  - Vérification que le tag existe bien, si ce n'est pas le cas le tag dans le firstIdea sera null
    **  - Vérification que l'user peux créer sa waifu (vérification faites grâce à son grade)
    ** Retour:
    **  - false si jamais il y a un problème dans les données
    **  - true si tout se passe bien
    */
    async createWaifu(waifuDto: WaifuDto) {
        //Vérification des clés obligatoires
        for (let key in this.mandatoryKeys) {
            if (!Object.keys(waifuDto).includes(this.mandatoryKeys[key])) {
                return (false);
            }
        }
        //Suppression des clés inutiles
        for (let key in Object.keys(waifuDto)) {
            if (!this.possibleKeys.includes(key)) {
                delete waifuDto[key];
            }
        }
        //Vérification du champ age pour savoir si c'est bien un nombre
        if (isNaN(waifuDto.age)) {
            return (false);
        }
        //Vérification que le tag existe
        let user = await this.userService.getUserByTag(waifuDto.firstIdea);
        if (user == undefined) {
            waifuDto.firstIdea = null;
        }
        //Vérification que l'user n'as pas créer plus de 3 waifus2
        if (waifuDto.firstIdea != null) {
            let waifuList: Array<WaifuDto> = await this.getAllWaifuByTag(user.tag);
            let userGrade: UserGradeDTO = await this.userGradeService.getGradeByName(user.grade);
            if (waifuList.length >= userGrade.nbWaifuCreate) {
                return (false);
            }
        }
        //Création de l'objet dans la db
        await this.waifuRepository.save(waifuDto);
        return (true);
    }

    /*
    ** Suppression d'une waifu via son id.
    ** Sécurité:
    **  - Vérification de si id est de type int
    **  - Vérification de l'existance de la waifu
    ** Retour:
    **  - false si jamais un problème existe dans les paramètres ou bien un crash quelconque existe
    **  - true si tout se passe bien
    */
    async deleteWaifu(id: number) {
        //Vérification que l'id est un int
        if (isNaN(id)) {
            return (false);
        }
        //Vérification de l'existance de la waifu
        this.waifuRepository.findOne(id).then(
            (res) => {
                if (res == undefined) {
                    //Non existance de la waifu
                    return (false);
                }
            },
            (_) => {
                //En cas de crash quelconque
                return (false);
            }
            );
            //Deletion de la waifu
            this.waifuRepository.remove(new Waifu(Number(id))).then(
            (_) => {
                //En cas de succès
                return (true);
            },
            (_) => {
                //En cas de crash quelconque
                return (false);
            }
        );
        //Existance de la waifu
        return (true);
    }

    /*
    ** Méthode permettant d'avoir tout les waifu existante
    */
    async getAllWaifu() {
        let waifuList = await this.waifuRepository.find();

        return (waifuList);
    }

    /*
    ** Méthode permettant d'avoir une waifu via son id
    ** Sécurité:
    **  - Vérification que l'id soit bien un int
    ** Retour:
    **  - Waifu si une waifu est associé a l'id
    **  - undefined si la waifu n'existe pas ou bien que l'id ne soit pas un int
    */
    async getWaifuById(id: number) {
        //Vérification que l'id est un int
        if (isNaN(id)) {
            return (undefined);
        }
        return (await this.waifuRepository.findOne(id));
    }

    /*
    ** Méthode permettant de modifier une waifu via son id
    ** Sécurité:
    **  - Vérification que l'id soit bien un int
    **  - Suppression des clés inutiles
    **  - Vérification que l'id soit associé a une waifu
    ** Retour:
    **  - false si jamais un problème existe dans la requete
    **  - true si jamais tout s'est bien passé
    */
    async putWaifuById(id: number, waifuDto: WaifuDto) {
        //Vérification que l'id soit un int
        if (isNaN(id)) {
            return (false);
        }
        //Suppression des clés inutiles
        for (let key in waifuDto) {
            if (!this.possibleKeys.includes(key)) {
                delete waifuDto[key];
            }
        }
        //Vérification de l'existence de la waifu
        let waifu = await this.waifuRepository.findOne(id);
        if (waifu == undefined) {
            //La waifu n'existe pas
            return (false);
        }
        await this.waifuRepository.update(id, waifuDto);
        return (true);
    }

    /*
    ** Méhtode permettant de supprimer tout les champs contenant le tag d'un user
    ** Paramètres:
    **  - tag: tag de l'user qu'on veux supprimer
    */
    async deleteWaifuTag(tag: string) {
        await this.waifuRepository.query(`UPDATE Waifu SET firstIdea=NULL WHERE firstIdea='${tag}'`)
    }

    /*
    ** Méthode permettant de lister toutes les waifus via son tag
    ** Paramètres:
    **  - tag : tag de l'utilisateur
    ** Retour:
    **  Array<WaifuDto> : liste des waifus correspondantes
    */
    async getAllWaifuByTag(tag: string) {
        return (await this.waifuRepository.find({
            where: {
                firstIdea: tag
            }
        }));
    }

    /*
    ** Méthode permettant d'ajouter des points à une waifu
    ** Paramètres:
    **  - id: id de la waifu dont on doit ajouter les points
    **  - amount: montant des points à ajouter
    ** Sécurité:
    **  - Vérification que l'id soit un nombre
    **  - Vérification que l'amount soit un nombre
    **  - Vérification que l'id soit associé à une waifu
    ** Retour:
    **  - false: si jamais un problème existe
    **  - true: si tout se passe bien
    */
    async addWaifuPoints(id: number, amount: number) {
        //Vérification que l'id soit un nombre
        if (isNaN(id)) {
            return (false);
        }
        //Vérification que l'amount soit un nombre
        if (isNaN(amount)) {
            return (false);
        }
        //Vérification que l'id soit associé à une waifu
        let waifu = await this.getWaifuById(id);
        if (waifu == undefined) {
            return (false);
        }
        //Ajout des points dans la waifu
        await this.waifuRepository.update(id, {
            points: +waifu.points + +amount
        });
        return (true);
    }

}
