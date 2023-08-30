// @ts-ignore
import nodemailer from 'nodemailer';
import config from '../../config/index';

interface MailInterface {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
}

export default class MailService {
  private static instance: MailService;
  private transporter: nodemailer.Transporter;

  private constructor() {}

  //INSTANCE CREATE FOR MAIL
  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  //CREATE CONNECTION FOR LOCAL
  async createLocalConnection() {
    try {
      const account = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });
      console.log('Email configured with success');
    } catch (err: any) {
      console.log(err);
    }
  }

  //CREATE A CONNECTION FOR LIVE
  async createConnection() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email_user_account,
          pass: config.email_user_password
        }
      });
    } catch (err: any) {
      console.log(err, 'error');
    }
  }

  //SEND MAIL
  async sendMail(options: MailInterface) {
    return await this.transporter
      .sendMail({
        from: `${process.env.EMAIL_USER || options.from}`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html
      })
      .then((info: any) => {
        console.log(`Mail sent successfully!!`);
        console.log(`[MailResponse]=${info.response} [MessageID]=${info.messageId}`);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return info;
      })
      .catch((error: any) => {
        console.log(error, 'error on sending email');
      });
  }

  //VERIFY CONNECTION
  async verifyConnection() {
    return this.transporter.verify();
  }

  //CREATE TRANSPORTER
  getTransporter() {
    return this.transporter;
  }
}
