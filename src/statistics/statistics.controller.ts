import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { PayloadType } from 'src/tokens/types/payload.type';
import { ResponseType } from './types/response.type';
import { StatisticsDocument } from './schemas/statistics.schema';

@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('get-statistics')
  async getStatistics(
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<ResponseType<StatisticsDocument> | undefined> {
    const { _id } = req.user;
    const data = this.statisticsService.getStatistics(_id);
    return data;
  }
}
