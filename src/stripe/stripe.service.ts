import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(private configService: ConfigService) {}

  private stripe: Stripe = new Stripe(
    this.configService.get<string>('STRIPE_SK'),
    {
      apiVersion: '2020-08-27',
    },
  );

  async createCheckoutSession(
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[],
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      success_url: `${this.configService.get<string>(
        'PRODUCTION',
      )}api/vinyls/success`,
      cancel_url: `${this.configService.get<string>(
        'PRODUCTION',
      )}api/vinyls/cancel`,
    });
  }

  async getPaymentIntents() {
    return this.stripe.paymentIntents.list();
  }
}
