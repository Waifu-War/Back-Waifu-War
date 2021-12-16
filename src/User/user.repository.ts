import { EntityRepository, Repository } from "typeorm";
import { UserDto } from "./user.DTO";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    createUser = async (userDto: UserDto) => {
        return (await this.save(userDto));
    }

    getAllUser = async () => {
        return (await this.find());
    }

    findById = async (id: number) => {
        return (await this.findOne(id));
    }

}