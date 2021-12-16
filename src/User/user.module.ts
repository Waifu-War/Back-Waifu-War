import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaifuModule } from 'src/waifu/waifu.module';
import { UserController } from './user.endpoints';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => WaifuModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}