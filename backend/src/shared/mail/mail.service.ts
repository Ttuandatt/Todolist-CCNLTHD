import { Injectable, Logger } from '@nestjs/common';

// Brevo SDK v5 — dùng BrevoClient thay vì TransactionalEmailsApi
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BrevoClient } = require('@getbrevo/brevo');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly isDev = process.env.MAIL_DRIVER === 'mock';

  // Brevo SDK v5: dùng BrevoClient → client.transactionalEmails
  private readonly brevoClient: any;

  constructor() {
    if (this.isDev) {
      this.logger.log('Mail service đang chạy ở chế độ MOCK (không gửi email thật).');
      return;
    }

    try {
      if (!process.env.BREVO_API_KEY) {
        this.logger.error('BREVO_API_KEY chưa được cấu hình!');
        return;
      }

      this.brevoClient = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
      this.logger.log('Brevo API đã được khởi tạo thành công (SDK v5).');
    } catch (e) {
      this.logger.error(`Lỗi khởi tạo Brevo: ${e.message}`);
    }
  }

  private get sender() {
    return {
      email: process.env.BREVO_SENDER_EMAIL || 'tuandatpcanh@gmail.com',
      name: process.env.BREVO_SENDER_NAME || 'TodoList Collaboration',
    };
  }

  private async sendMail(
    email: string,
    name: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    if (this.isDev) {
      this.logger.log(`[DEV MODE] Gửi tới: ${email} | Subject: ${subject}`);
      return;
    }

    if (!this.brevoClient) {
      this.logger.error('Brevo Client chưa được khởi tạo!');
      return;
    }

    try {
      // Brevo SDK v5: client.transactionalEmails.sendTransacEmail()
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject: subject,
        htmlContent: htmlContent,
        sender: this.sender,
        to: [{ email, name }],
        replyTo: { email: this.sender.email },
      });
      
      this.logger.log(`Email gửi thành công tới ${email}`);
    } catch (error: any) {
      const errorDetail = error.response?.body?.message || error.message;
      this.logger.error(`Lỗi gửi email tới ${email}: ${errorDetail}`);
    }
  }

  /**
   * Gửi email đặt lại mật khẩu
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetLink: string,
  ): Promise<void> {
    const subject = 'Đặt lại mật khẩu TodoList Collaboration';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Xin chào ${name},</h2>

        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>

        <p style="margin: 30px 0;">
          <a href="${resetLink}"
             style="display: inline-block; padding: 12px 30px; background-color: #4CAF50;
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Đặt lại mật khẩu
          </a>
        </p>

        <p style="color: #666; font-size: 14px;">
          <strong>Liên kết này sẽ hết hạn sau 15 phút.</strong>
        </p>

        <p style="color: #999; font-size: 12px;">
          Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.<br>
          &copy; 2026 TodoList Collaboration. All rights reserved.
        </p>
      </div>
    `;
    await this.sendMail(email, name, subject, htmlContent);
  }

  /**
   * Gửi email xác nhận địa chỉ email
   */
  async sendEmailVerificationEmail(
    email: string,
    name: string,
    verifyLink: string,
  ): Promise<void> {
    const subject = 'Xác nhận email của bạn';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Chào ${name}!</h2>

        <p>Vui lòng xác nhận email của bạn bằng cách click vào nút dưới đây:</p>

        <p style="margin: 30px 0;">
          <a href="${verifyLink}"
             style="display: inline-block; padding: 12px 30px; background-color: #2196F3;
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Xác nhận email
          </a>
        </p>

        <p style="color: #666; font-size: 14px;">
          Liên kết có hiệu lực trong 24 giờ.
        </p>

        <p style="color: #999; font-size: 12px;">
          &copy; 2026 TodoList Collaboration. All rights reserved.
        </p>
      </div>
    `;
    await this.sendMail(email, name, subject, htmlContent);
  }

  /**
   * Gửi email chào mừng thành viên mới
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = 'Chào mừng tới TodoList Collaboration!';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Chào mừng ${name}!</h2>

        <p>Tài khoản của bạn đã được tạo thành công!</p>

        <p>Bây giờ bạn có thể:</p>
        <ul>
          <li>Tạo không gian làm việc (Workspace)</li>
          <li>Mời các thành viên cùng làm việc</li>
          <li>Quản lý dự án và nhiệm vụ hiệu quả</li>
        </ul>

        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="display: inline-block; padding: 12px 30px; background-color: #FF9800;
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Vào Dashboard
          </a>
        </p>

        <p style="color: #999; font-size: 12px;">
          &copy; 2026 TodoList Collaboration. All rights reserved.
        </p>
      </div>
    `;
    await this.sendMail(email, name, subject, htmlContent);
  }
}