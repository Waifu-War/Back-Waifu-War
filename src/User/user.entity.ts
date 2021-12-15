import { WaifuCreated } from "src/waifuCreated/waifuCreated.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    startDate: Date

    @Column()
    nbWaifuCreated: number

    @OneToMany(() => WaifuCreated, waifuCreated => waifuCreated.user)
    waifuCreated: WaifuCreated[]

}