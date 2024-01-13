import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { PayloadType } from 'src/tokens/types/payload.type';
import { ResponseType } from './types/response.type';
import { StatisticsDocument } from './schemas/statistics.schema';
import { API_URL } from 'src/utilities/constants';

@UseGuards(JwtAuthGuard)
@Controller('statistics')
@ApiTags('statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('get-statistics')
  @ApiOperation({
    summary: 'Get user statistics',
    description: 'Returns user statistics',
    externalDocs: {
      url: `${API_URL}api/v1/statistics/get-statistics`,
      description: 'Link to statistics endpoint',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Return user statistics',
    type: ResponseType<StatisticsDocument>,
  })
  async getStatistics(
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<ResponseType<StatisticsDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.statisticsService.getStatistics(_id);
    return data;
  }
}
