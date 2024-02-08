import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { User, UserSchema } from './schemas/user.schema';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { CalendarsModule } from 'src/calendars/calendars.module';
import { TodosModule } from 'src/todos/todos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SendgridModule,
    CloudinaryModule,
    TokensModule,
    StatisticsModule,
    CalendarsModule,
    TodosModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
