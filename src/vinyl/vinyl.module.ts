import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { VinylEntity } from './vinyl.entity';
import { UserModule } from '../user/user.module';
import { ReviewModule } from '../review/review.module';
import { StripeModule } from '../stripe/stripe.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VinylEntity]),
    forwardRef(() => UserModule),
    ReviewModule,
    StripeModule,
    MailModule,
  ],
  controllers: [VinylController],
  providers: [VinylService],
  exports: [VinylService],
})
export class VinylModule {}
