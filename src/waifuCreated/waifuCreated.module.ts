import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaifuCreated } from './waifuCreated.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WaifuCreated])],
    providers: [],
    controllers: []
})
export class WaifuCreatedModule {}