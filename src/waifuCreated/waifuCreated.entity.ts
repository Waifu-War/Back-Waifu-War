import { User } from "src/User/user.entity";
import { Waifu } from "src/waifu/waifu.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("WaifuCreated")
export class WaifuCreated {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    waifuId: number

    @ManyToOne(() => User, user => user.waifuCreated, {
        onDelete: "CASCADE"
    })
    user: User

    @ManyToOne(() => Waifu, waifu => waifu.created, {
        onDelete: "CASCADE"
    })
    waifu: Waifu

}
