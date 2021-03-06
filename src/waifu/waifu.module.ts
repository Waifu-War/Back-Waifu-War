import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/User/user.module';
import { UserGradeModule } from 'src/userGrades/userGrade.module';
import { WaifuController } from './waifu.endpoints';
import { Waifu } from './waifu.entity';
import { WaifuService } from './waifu.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Waifu]),
        forwardRef(() => UserModule),
        forwardRef(() => UserGradeModule)
    ],
    providers: [WaifuService],
    controllers: [WaifuController],
    exports: [WaifuService]
})
export class WaifuModule {}