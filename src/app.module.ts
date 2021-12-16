import { Module } from '@nestjs/common';
import { AppController } from './app.endpoints';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waifu } from './waifu/waifu.entity';
import { WaifuModule } from './waifu/waifu.module';
import { UserModule } from './User/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Doudoune34200',
            database: 'WaifuWar',
            entities: [Waifu],
            synchronize: true,
            autoLoadEntities: true
        }),
        WaifuModule,
        UserModule  
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
