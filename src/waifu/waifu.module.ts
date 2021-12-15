import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaifuController } from './waifu.endpoints';
import { Waifu } from './waifu.entity';
import { WaifuService } from './waifu.service';

@Module({
    imports: [TypeOrmModule.forFeature([Waifu])],
    providers: [WaifuService],
    controllers: [WaifuController]
})
export class WaifuModule {}