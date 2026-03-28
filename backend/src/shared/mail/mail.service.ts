import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly isDev = process.env.MAIL_DRIVER === 'mock';

  constructor() {
    // Khởi tạo SendGrid nếu không phải dev mode
    if (!this.isDev && process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }
  }

  /**
   * Gửi email xác nhận đổi password
   * @param email Email của user
   * @param name Tên user
   * @param resetLink Link click để đổi password (kèm token)
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetLink: string,
  ): Promise<void> {
    const subject = '🔐 Đặt lại mật khẩu TodoList Collaboration';
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
          ⏰ <strong>Liên kết này sẽ hết hạn sau 15 phút</strong>
        </p>

        <p style="color: #999; font-size: 12px;">
          Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.<br>
          © 2026 TodoList Collaboration. All rights reserved.
        </p>
      </div>
    `;

    const msg = {
      to: email,
      from: process.env.MAIL_FROM || 'noreply@todolist-collab.com',
      replyTo: 'support@todolist-collab.com',
      subject,
      html: htmlContent,
    };

    try {
      if (this.isDev) {
        // Mode dev: In ra console
        this.logger.log(`[DEV MODE] Email sẽ được gửi tới: ${email}`);
        this.logger.log(`Reset Link: ${resetLink}`);
        return;
      }

      // Mode prod: Gửi thực qua SendGrid
      await sgMail.send(msg);
      this.logger.log(`Email gửi thành công tới ${email}`);
    } catch (error) {
      this.logger.error(`Lỗi gửi email: ${error.message}`);
      // Không throw - email fail không nên block user
    }
  }

  /**
   * Gửi email xác nhận verification (optional)
   */
  async sendEmailVerificationEmail(
    email: string,
    name: string,
    verifyLink: string,
  ): Promise<void> {
    const subject = '📧 Xác nhận email của bạn';
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
        <p style="color: #666; font-size: 14px;">⏰ Liên kết có hiệu lực trong 24 giờ</p>
      </div>
    `;

    const msg = {
      to: email,
      from: process.env.MAIL_FROM || 'noreply@todolist-collab.com',
      subject,
      html: htmlContent,
    };

    try {
      if (this.isDev) {
        this.logger.log(`[DEV MODE] Email verify sẽ được gửi tới: ${email}`);
        this.logger.log(`Verify Link: ${verifyLink}`);
        return;
      }

      await sgMail.send(msg);
      this.logger.log(`Email verify gửi thành công tới ${email}`);
    } catch (error) {
      this.logger.error(`Lỗi gửi email verify: ${error.message}`);
    }
  }

  /**
   * Gửi email thông báo welcome (optional)
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = '🎉 Chào mừng tới TodoList Collaboration!';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Chào mừng ${name}! 🎉</h2>
        <p>Tài khoản của bạn đã được tạo thành công!</p>
        <p>Bây giờ bạn có thể:</p>
        <ul>
          <li>✅ Tạo không gian làm việc (Workspace)</li>
          <li>✅ Mời các thành viên cùng làm việc</li>
          <li>✅ Quản lý dự án và nhiệm vụ hiệu quả</li>
        </ul>
        <p style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/dashboard"
             style="display: inline-block; padding: 12px 30px; background-color: #FF9800;
                    color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Vào Dashboard
          </a>
        </p>
      </div>
    `;

    const msg = {
      to: email,
      from: process.env.MAIL_FROM || 'noreply@todolist-collab.com',
      subject,
      html: htmlContent,
    };

    try {
      if (this.isDev) {
        this.logger.log(`[DEV MODE] Welcome email sẽ được gửi tới: ${email}`);
        return;
      }

      await sgMail.send(msg);
      this.logger.log(`Welcome email gửi thành công tới ${email}`);
    } catch (error) {
      this.logger.error(`Lỗi gửi welcome email: ${error.message}`);
    }
  }
}
