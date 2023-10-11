import nodemailer, { Transporter } from "nodemailer";
import config from "../config";

export default class Email {
  to: string | undefined;
  name: string | undefined;
  from: string | undefined;
  url: string | undefined;
  constructor(user: any, url: string) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Ngoc Hung <${config.EMAIL_USERNAME}>`;
    this.url = url;
  }

  newTransport(): Transporter {
    if (config.NODE_ENV === "production") {
      return nodemailer.createTransport({
        // Chưa tìm được mail server
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
        },
      });
    }

    const something = {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD,
      },
    };

    return nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  async send(message: string, subject: string): Promise<any> {
    const mailOptions: object = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(): Promise<any> {
    await this.send(
      `Hello ${this.name}. Please click the link below to verify your email account:\n ${this.url}`,
      "Welcome to the Natours Family!"
    );
  }

  async sendPasswordReset(): Promise<any> {
    await this.send(
      `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.\nIf you didn't forget your password, please ignore this email!`,
      "Your password reset token Valid for only 10 minutes)"
    );
  }
}
