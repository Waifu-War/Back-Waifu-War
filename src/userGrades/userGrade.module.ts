import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserGradeController } from "./userGrade.endpoints";
import { UserGrade } from "./userGrade.entity";
import { UserGradeService } from "./userGrade.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserGrade])],
    providers: [UserGradeService],
    controllers: [UserGradeController],
    exports: [UserGradeService]
})
export class UserGradeModule {}