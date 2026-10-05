import {Body, Controller, Post, Res, HttpException, BadRequestException, UseGuards, Logger, } from '@nestjs/common';
import type { Response } from 'express';
import { BotService } from './bot.service.js';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('bot')
@UseGuards(ThrottlerGuard)
export class BotController {
  constructor(private botService: BotService) {}

  private readonly logger = new Logger(BotController.name);

  private validate(message: unknown): string {
    if (typeof message !== 'string' || message.trim() === '') {
      throw new BadRequestException('Message is required.');
    }

    if (message.length > 1000) {
      throw new BadRequestException(
        'Message is too long (max 1000 characters).',
      );
    }

    return message.trim();
  }

  @Post('stream')
  async stream(
    @Body() body: { message: string },
    @Res() res: Response,
  ) {
    const message = this.validate(body.message);

    const abort = new AbortController();

    res.on('close', () => {
      if (!res.writableEnded) {
        this.logger.log(
          'Client disconnected, cancelling Gemini request',
        );
        abort.abort();
      }
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      for await (
        const text of this.botService.chatStream(
          message,
          abort.signal,
        )
      ) {
        if (abort.signal.aborted)
          break;

        res.write(`data: ${JSON.stringify(text)}\n\n`);
      }

      if (!abort.signal.aborted) {
        res.write('data: [DONE]\n\n');
      }
    } catch (err) {
      if (abort.signal.aborted)
        return;

      let errorMessage: string;

      if (err instanceof HttpException) {
        errorMessage = err.message;
      } else {
        errorMessage = 'Something went wrong, please try again.';
      }

      res.write(
        `event: error\ndata: ${JSON.stringify(errorMessage)}\n\n`,
      );
    } finally {
      res.end();
    }
  }
}