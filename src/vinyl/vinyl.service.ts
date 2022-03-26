import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinylCreatePayloadDto } from './dto/VinylCreatePayload.dto';
import { FindVinylByNameAndAuthorNamePayloadDto } from './dto/FindVinylByNameAndAuthorNamePayload.dto';
import { IBuyVinylRecordByVinylIdAndUserId } from './interfaces/IBuyVinylRecordByVinylIdAndUserId';
import { UserService } from '../user/user.service';
import { IAddReviewToVinyl } from './interfaces/IAddReviewToVinyl';
import { UserEntity } from '../user/user.entity';
import { IReviewCreatePayload } from '../review/interfaces/IReviewCreatePayload';
import { ReviewEntity } from '../review/review.entity';
import { vinylEntitiesToVinyls } from '../mappers/vinylEntitiesToVinyls';
import { IVinylOutput } from '../mappers/interfaces/IVinylOutput';
import { StripeService } from '../stripe/stripe.service';
import { IUrlToBuyVinyl } from './interfaces/IUrlToBuyVinyl';
import { IUpdateCheckInfoForStripe } from '../user/interfaces/IUpdateCheckInfoForStripe';
import { MailService } from '../mail/mail.service';
import { IMessage } from './interfaces/IMessage';
import { VinylEntity } from './vinyl.entity';
import { Vinyl } from './vinyl';
import { vinylEntityToVinyl } from '../mappers/vinylEntityToVinyl';
import { ReviewService } from '../review/review.service';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(VinylEntity)
    private vinylsRepository: Repository<VinylEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private reviewService: ReviewService,
    private stripeService: StripeService,
    private readonly mailService: MailService,
  ) {}

  async getVinyls(): Promise<VinylEntity[]> {
    const vinyls: VinylEntity[] = await this.vinylsRepository.find();
    if (!vinyls) {
      throw new NotFoundException();
    }
    return vinyls;
  }

  async getVinylsOutput(): Promise<IVinylOutput[]> {
    const vinyls: VinylEntity[] = await this.vinylsRepository.find();
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    if (!vinyls) {
      throw new NotFoundException();
    }
    return vinylEntitiesToVinyls({ vinyls, reviews });
  }

  async getVinylById(id: number): Promise<VinylEntity> {
    const vinyl: VinylEntity = await this.vinylsRepository.findOne({ id: id });
    if (!vinyl) {
      throw new NotFoundException();
    }
    return vinyl;
  }

  async getVinylByName(name: string): Promise<VinylEntity[]> {
    return await this.vinylsRepository.find({
      name: name,
    });
  }

  async getVinylByNameOutput(name: string): Promise<IVinylOutput[]> {
    const vinylsWithName: VinylEntity[] = await this.getVinylByName(name);
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    if (vinylsWithName.length == 0) {
      throw new NotFoundException();
    }
    return vinylEntitiesToVinyls({ vinyls: vinylsWithName, reviews });
  }

  async getVinylByAuthorName(authorName: string): Promise<VinylEntity[]> {
    return await this.vinylsRepository.find({ authorName: authorName });
  }

  async getVinylByAuthorNameOutput(
    authorName: string,
  ): Promise<IVinylOutput[]> {
    const vinylsWithAuthorName: VinylEntity[] = await this.getVinylByAuthorName(
      authorName,
    );
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    if (vinylsWithAuthorName.length == 0) {
      throw new NotFoundException();
    }
    return vinylEntitiesToVinyls({ vinyls: vinylsWithAuthorName, reviews });
  }

  async getVinylByNameAndAuthorName(
    payload: FindVinylByNameAndAuthorNamePayloadDto,
  ): Promise<VinylEntity> {
    const vinylWithNameAndAuthorName: VinylEntity =
      await this.vinylsRepository.findOne({
        name: payload.name,
        authorName: payload.authorName,
      });
    if (!vinylWithNameAndAuthorName) {
      throw new NotFoundException();
    }
    return vinylWithNameAndAuthorName;
  }

  async getVinylByNameAndAuthorNameOutput(
    payload: FindVinylByNameAndAuthorNamePayloadDto,
  ): Promise<IVinylOutput> {
    const vinylWithNameAndAuthorName: VinylEntity =
      await this.getVinylByNameAndAuthorName(payload);
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    return vinylEntityToVinyl({
      vinyls: [],
      reviews,
      vinyl: vinylWithNameAndAuthorName,
    });
  }

  async getVinylsSortedByCheapPrice(): Promise<IVinylOutput[]> {
    const vinyls: VinylEntity[] = await this.getVinyls();
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    vinyls.sort(
      (prev: VinylEntity, next: VinylEntity) => prev.price - next.price,
    );
    return vinylEntitiesToVinyls({ vinyls, reviews });
  }

  async getVinylsSortedByExpensivePrice(): Promise<IVinylOutput[]> {
    const vinyls: VinylEntity[] = await this.getVinyls();
    const reviews: ReviewEntity[] = await this.reviewService.getReviews();
    vinyls.sort(
      (prev: VinylEntity, next: VinylEntity) => next.price - prev.price,
    );
    return vinylEntitiesToVinyls({ vinyls, reviews });
  }

  async createVinyl(createVinylPayload: VinylCreatePayloadDto): Promise<void> {
    try {
      const vinyl = new Vinyl(createVinylPayload);
      const newVinylEntity: VinylEntity = await this.vinylsRepository.create({
        ...vinyl,
      });
      await this.vinylsRepository.save(newVinylEntity);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async buyVinylById(
    payload: IBuyVinylRecordByVinylIdAndUserId,
  ): Promise<IUrlToBuyVinyl> {
    const findVinyl = await this.getVinylById(payload.vinylId);
    const findUser = await this.userService.getUserById(payload.userId);
    if (findVinyl.canBuy) {
      const order = [
        {
          name: findVinyl.name,
          amount: findVinyl.price * 100,
          currency: 'usd',
          quantity: 1,
        },
      ];
      const { url, payment_intent } =
        await this.stripeService.createCheckoutSession(order);

      const payloadCheck: IUpdateCheckInfoForStripe = {
        userId: findUser.id,
        checkPayment: String(payment_intent),
        checkVinylId: String(payload.vinylId),
      };

      await this.userService.updateCheck(payloadCheck);

      return { url: url };
    } else {
      throw new BadRequestException();
    }
  }

  async getVinylsByUserId(id: number): Promise<VinylEntity[]> {
    const userVinyls: VinylEntity[] = await this.vinylsRepository.find({
      relations: ['user'],
    });
    if (!userVinyls) {
      throw new NotFoundException();
    }
    return userVinyls.filter((vinyl: VinylEntity) => {
      if (vinyl.user) {
        if (vinyl.user.id === id) {
          return true;
        }
      }
    });
  }

  async addReviewToVinyl(payload: IAddReviewToVinyl): Promise<void> {
    const user: UserEntity = await this.userService.getUserById(payload.userId);
    const vinyl: VinylEntity = await this.getVinylById(payload.vinylId);

    const createReviewPayload: IReviewCreatePayload = {
      comment: payload.comment,
      score: payload.score,
      authorName: user.email,
    };

    const review: ReviewEntity = await this.reviewService.createReview(
      createReviewPayload,
    );

    return await this.reviewService.connectReviewFromUserToVinyl({
      review,
      user,
      vinyl,
    });
  }

  async saveBoughtVinylByUser(): Promise<IMessage> {
    const payments_intent = await this.stripeService.getPaymentIntents();
    const users: UserEntity[] = await this.userService.getUsers();
    const ourUser: UserEntity = users.find(
      (user) => user.checkPayment !== 'null',
    );
    if (payments_intent) {
      if (!ourUser) {
        return { message: "Error payment. You don't buy vinyl record" };
      }
      const myPayment = payments_intent.data.find(
        (element) => element.id === ourUser.checkPayment,
      );
      if (myPayment) {
        const findVinyl = await this.getVinylById(Number(ourUser.checkVinylId));
        findVinyl.user = ourUser;
        await this.vinylsRepository.save(findVinyl);
        await this.vinylsRepository.update(findVinyl.id, { canBuy: false });
        await this.userService.updateCheck({
          userId: ourUser.id,
          checkVinylId: 'null',
          checkPayment: 'null',
        });
        await this.mailService.send({
          email: ourUser.email,
          firstName: ourUser.firstName,
          vinyl: findVinyl,
        });
        return { message: 'Success payment. Check out your mail for details!' };
      }
    }
  }
}
