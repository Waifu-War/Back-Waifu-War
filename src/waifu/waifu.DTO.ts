export interface WaifuDto {

    readonly id: number

    nickname: string
    lastname: string
    firstname: string
    age: number
    img: string // path de l'img (upload sur discord)
    manga: string // manga OU anime dont il fais ref
    gradeAverage: number // la note moyenne que les gens auront mise
    nbLikes: number
    leaderboard: number // place dans le classement de la waifuisation
    firstIdea: string // mec qui a eu l'idée de le rajouter
    points: number

    //Waifu Statistics
    atk: number
    life: number
    def: number
    speed: number
    mana: number
    luck: number

    readonly creationDate: Date // date d'ajout

}