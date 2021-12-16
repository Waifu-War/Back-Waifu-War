import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("User")
export class User {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column()
    tag: string

    @Column()
    grade: string

    @Column({nullable: true})
    startDate: Date

    @Column({default: 0})
    nbWaifuCreated: number

}