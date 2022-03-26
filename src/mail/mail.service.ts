import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailPayload } from './interfaces/ISendMailPayload';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(payload: ISendMailPayload): Promise<void> {
    await this.mailerService
      .sendMail({
        to: payload.email,
        from: 'Vinyl Store <str4lr3nvalojvrn@ethereal.email>',
        subject: 'Info about Payment',
        text: "You've successfully bought a vinyl record.\n",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                h1 {
                    color: blue;
                }
            </style>
        </head>
        <body>
            <h1>Info about vinyl record:</h1>
            <div><b>Name: ${payload.vinyl.name}</b></div>
            <div><b>Author: ${payload.vinyl.authorName}</b></div>
            <div><b>Description: ${payload.vinyl.description}</b></div>
            <div><b>Image: ${payload.vinyl.image}</b></div>
            <div><b>Price: ${payload.vinyl.price}$</b></div>
        </body>
        </html>`,
      })
      .then((success) => {
        console.log('Success mail');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
