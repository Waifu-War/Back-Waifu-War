import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("UserGrade")
export class UserGrade {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string

    @Column()
    nbWaifuCreate: number

}