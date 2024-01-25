import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { EmailType } from './types/email.type';
import { API_URL, CLIENT_URL_PROD } from 'src/utilities/constants';

@Injectable()
export class SendgridService {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(data: EmailType): Promise<boolean> {
    const email = { ...data, from: process.env.SENDGRID_OWNER };
    try {
      await sendgrid.send(email);
      return true;
    } catch (error) {
      return false;
    }
  }

  confirmEmail(email: string, activationToken: string) {
    return {
      to: email,
      subject: 'Account activation by WORK TIME',
      html: `
          <div>
             <h1>Welcome to Work-time site</h1>
            <br />
            <p>Thank you for registering on our site! To start using your account, please confirm its activation by clicking on the link below:</p>
            <br />
            <a target="_blank" href="${API_URL}/api/v1/users/activation-email/${activationToken}">Link to account activation page</a>
            <br />
            <p>If you have not registered on our site, just ignore this message.</p>
            <br />
            <p>Sincerely, site Team.</p>
          </div>
    `,
    };
  }

  resetPassword(email: string, name: string) {
    return {
      to: email,
      subject: 'Password reset by WORK TIME',
      html: `
          <div>
            <h1>Hello ${name}!</h1>
            <br />
            <p>You received this email because you requested a password reset on our site. To reset your password, please follow the link below:</p>
            <br />
            <a target="_blank" href="${CLIENT_URL_PROD}/auth/reset-password">Link to password reset page</a>
            <br />
            <p>If you did not request a password reset, please ignore this message.<p/>
            <br />
            <p>Sincerely, site Team.</p>
          </div>
    `,
    };
  }
}
