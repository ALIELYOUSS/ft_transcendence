import { Body, Controller, Post, Res, HttpException, UseGuards,  UsePipes, ValidationPipe, Logger, HttpCode, } from '@nestjs/common';
import type { Response } from 'express';
import { BotService } from './bot.service.js';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateChat } from './dto/create-chat.request.js';
import { ConfigService } from '@nestjs/config';

@Controller('bot')
@UseGuards(ThrottlerGuard)
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(BotController.name);

  @HttpCode(200)
  @Post('stream')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async stream(
    @Body() body: CreateChat,
    @Res() res: Response,
  ) {
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
      const userId = this.config.get<string>('TEST_USER_ID');
      if (!userId) {
        throw new Error('TEST_USER_ID is not configured.');
      }
      for await ( const text of this.botService.chatStream(
          body.messages,
          userId,
          abort.signal,
        )
      ) 
      {
        if (abort.signal.aborted)
          break;
        res.write(`data: ${JSON.stringify(text)}\n\n`);
      }
      if (!abort.signal.aborted)
      {
        res.write('data: [DONE]\n\n');
      }
    } catch (err)
    {
      if (abort.signal.aborted)
        return;
      const errorMessage =
        err instanceof HttpException
          ? err.message
          : 'Something went wrong, please try again.';

      res.write(
        `event: error\ndata: ${JSON.stringify(errorMessage)}\n\n`,
      );
    } finally {
      res.end();
    }
  }
}