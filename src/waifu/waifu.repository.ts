import { EntityRepository, Repository } from 'typeorm';
import { WaifuDto } from './waifu.DTO';
import { Waifu } from './waifu.entity';

@EntityRepository(Waifu)
export class WaifuRepository extends Repository<Waifu> {

    createWaifu = async (waifuDto: WaifuDto) => {
        return (await this.save(waifuDto));
    };

}