import { Context } from 'koa';
import { ApiResponse, VerifyPinDTO } from '../types';

export class AuthController {
  static async verifyPin(ctx: Context): Promise<void> {
    try {
      const body = ctx.request.body as VerifyPinDTO;
      const { pin } = body;
      const adminPin = process.env.ADMIN_PIN;

      if (!adminPin) {
        ctx.status = 500;
        const response: ApiResponse = {
          success: false,
          message: 'Admin PIN is not configured on server.',
        };
        ctx.body = response;
        return;
      }

      if (!pin || pin !== adminPin) {
        ctx.status = 401;
        const response: ApiResponse = {
          success: false,
          message: 'Invalid PIN.',
        };
        ctx.body = response;
        return;
      }

      ctx.status = 200;
      const response: ApiResponse = {
        success: true,
        message: 'PIN verified successfully.',
      };
      ctx.body = response;
    } catch (error) {
      console.error('❌ Error verifying admin PIN:', error);

      ctx.status = 500;
      const response: ApiResponse = {
        success: false,
        message: 'An internal error occurred while verifying PIN.',
      };
      ctx.body = response;
    }
  }
}
