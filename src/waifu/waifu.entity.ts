import { User } from 'src/User/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity("Waifu")
export class Waifu {

    constructor(id?: number) {
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nickname: string

    @Column()
    lastname: string

    @Column()
    firstname: string

    @Column()
    age: number

    @Column()
    img: string // path de l'img (upload sur discord)

    @Column()
    manga: string // manga OU anime dont il fais ref

    @Column({default: 0})
    gradeAverage: number // la note moyenne que les gens auront mise

    @Column({default: 0})
    nbLikes: number

    @Column({default: 0})
    leaderboard: number // place dans le classement de la waifuisation

    @Column({nullable: true})
    firstIdea: string // mec qui a eu l'idée de le rajouter

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creationDate: Date // date d'ajout

    @Column({default: 0})
    atk: number

    @Column({default: 0})
    life: number

    @Column({default: 0})
    def: number

    @Column({default: 0})
    speed: number

    @Column({default: 0})
    mana: number

    @Column({default: 0})
    luck: number

}