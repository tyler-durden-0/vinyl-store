import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylCreatePayloadDto } from './dto/VinylCreatePayload.dto';
import { FindVinylByNameAndAuthorNamePayloadDto } from './dto/FindVinylByNameAndAuthorNamePayload.dto';
import { IBuyVinylRecordByVinylIdAndUserId } from './interfaces/IBuyVinylRecordByVinylIdAndUserId';
import { IAddReviewToVinyl } from './interfaces/IAddReviewToVinyl';
import { ReviewPayloadDto } from './dto/ReviewPayload.dto';
import { IVinylOutput } from '../mappers/interfaces/IVinylOutput';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { USER_ROLES } from './roles.enum';
import { IUrlToBuyVinyl } from './interfaces/IUrlToBuyVinyl';
import { IMessage } from './interfaces/IMessage';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CHOOSE_PRISE } from './prices.enum';

@ApiTags('Vinyl Records')
@Controller('api/vinyls')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Get()
  @ApiOkResponse({ description: 'Array of vinyl records' })
  getVinyls(): Promise<IVinylOutput[]> {
    return this.vinylService.getVinylsOutput();
  }

  @Post('/search')
  @ApiCreatedResponse({
    description: 'Get vinyl record or records by name or author name',
  })
  @ApiNotFoundResponse({ description: 'No such vinyl record' })
  @ApiBadRequestResponse({ description: 'Invalid data request' })
  @ApiBody({ type: FindVinylByNameAndAuthorNamePayloadDto })
  getVinylByNameOrAuthorName(
    @Body() payload: FindVinylByNameAndAuthorNamePayloadDto,
  ): Promise<IVinylOutput[] | IVinylOutput> {
    if (payload.name || payload.authorName) {
      if (payload.name && !payload.authorName) {
        return this.vinylService.getVinylByNameOutput(payload.name);
      } else if (!payload.name && payload.authorName) {
        return this.vinylService.getVinylByAuthorNameOutput(payload.authorName);
      } else if (payload.name && payload.authorName) {
        return this.vinylService.getVinylByNameAndAuthorNameOutput(payload);
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Get('/sort?')
  @ApiOkResponse({
    description: 'Search vinyl records by price expensive or cheap',
  })
  @ApiQuery({ name: 'price', enum: CHOOSE_PRISE })
  getVinylSortedByPrice(
    @Query('price') price: string,
  ): Promise<IVinylOutput[]> {
    if (price === 'cheap') {
      return this.vinylService.getVinylsSortedByCheapPrice();
    } else if (price === 'expensive') {
      return this.vinylService.getVinylsSortedByExpensivePrice();
    } else {
      throw new BadRequestException();
    }
  }

  @Post('/addVinyl')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized, please login' })
  @ApiCreatedResponse({ description: 'Vinyl record was created successfully' })
  @ApiForbiddenResponse({ description: 'Only admin can add new vinyl record' })
  @ApiBadRequestResponse({ description: 'Invalid data request' })
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({ type: VinylCreatePayloadDto })
  addVinyl(@Body() createVinylPayload: VinylCreatePayloadDto): Promise<void> {
    return this.vinylService.createVinyl(createVinylPayload);
  }

  @Post('/:id/buy')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized, please login' })
  @ApiCreatedResponse({ description: 'Return url to pay for vinyl record' })
  @ApiBadRequestResponse({ description: 'You can not buy this vinyl record' })
  @Roles(USER_ROLES.USER, USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  buyVinylRecordByVinylId(
    @Param('id') id: string,
    @Request() req,
  ): Promise<IUrlToBuyVinyl> {
    const payload: IBuyVinylRecordByVinylIdAndUserId = {
      userId: Number(req.user.id),
      vinylId: Number(id),
    };
    return this.vinylService.buyVinylById(payload);
  }

  @Post('/:id/addReview')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized, please login' })
  @ApiCreatedResponse({
    description: 'You successfully add review to vinyl record',
  })
  @ApiBadRequestResponse({ description: 'Invalid data request' })
  @Roles(USER_ROLES.USER, USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addReview(
    @Param('id') id: string,
    @Body() reviewPayload: ReviewPayloadDto,
    @Request() req,
  ): Promise<void> {
    try {
      const payload: IAddReviewToVinyl = {
        vinylId: Number(id),
        userId: Number(req.user.id),
        comment: reviewPayload.comment,
        score: reviewPayload.score,
      };
      return this.vinylService.addReviewToVinyl(payload);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Get('/success')
  @ApiOkResponse({
    description:
      'Return Error payment just because this is end of payment for stripe after all, and not for user',
  })
  successSession(): Promise<IMessage> {
    return this.vinylService.saveBoughtVinylByUser();
  }

  @Get('/cancel')
  @ApiOkResponse({
    description: 'Return cancel of stripe payment when this happens',
  })
  cancelSession(): IMessage {
    return { message: 'Cancel of payment' };
  }
}
