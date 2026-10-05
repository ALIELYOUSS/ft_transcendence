import { Injectable, Logger, ServiceUnavailableException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class BotService {
  private ai: GoogleGenAI;

  constructor(private config: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.config.get<string>('GEMINI_API_KEY'),
    });
  }

  private readonly logger = new Logger(BotService.name);

  private readonly firstTextTimeoutMs = 8000;
  private readonly streamTimeoutMs = 5000;

  private getModels(): string[] {
    const main = this.config.get<string>('GEMINI_MODEL')!;
    const fallback = this.config.get<string>('GEMINI_FALLBACK_MODELS');

    if (!fallback) {
      return [main];
    }

    return [main, ...fallback.split(',')];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  async *chatStream(message: string, clientSignal?: AbortSignal) {
    for (const model of this.getModels()) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        let started = false;
        let timedOut = false;
        let streamTimedOut = false;

        const controller = new AbortController();

        const timer = setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, this.firstTextTimeoutMs);

        let streamTimer: ReturnType<typeof setTimeout> | undefined;

        const resetStreamTimer = () => {
          if (streamTimer)
            clearTimeout(streamTimer);

          streamTimer = setTimeout(() => {
            streamTimedOut = true;
            controller.abort();
          }, this.streamTimeoutMs);
        };

        const signals = [controller.signal];

        if (clientSignal)
          signals.push(clientSignal);

        try {
          const stream = await this.ai.models.generateContentStream({
            model,
            contents: message,
            config: { abortSignal: AbortSignal.any(signals) },
          });

          for await (const chunk of stream) {
            if (chunk.text) {
              if (!started) {
                clearTimeout(timer);
                started = true;
                resetStreamTimer();
              } else {
                resetStreamTimer();
              }

              yield chunk.text;
            }
          }

          return;
        } catch (err: any) {
          if (clientSignal?.aborted)
            return;

          if (started) {
            if (streamTimedOut) {
              this.logger.warn(
                `${model} stream timed out after ${this.streamTimeoutMs}ms without new data`,
              );
            }

            throw err;
          }

          const status = err?.status;

          if (timedOut) {
            this.logger.warn(
              `${model} timed out, attempt ${attempt}`,
            );
          } else {
            this.logger.warn(
              `${model} failed (status ${status}), attempt ${attempt}`,
            );
          }

          if (timedOut || status === 404)
            break;

          if (status !== 503 && status !== 429)
            throw err;

          await this.sleep(1000 * attempt);
        } finally {
          clearTimeout(timer);

          if (streamTimer)
            clearTimeout(streamTimer);
        }
      }
    }

    this.logger.error('All Gemini models/attempts failed');

    throw new ServiceUnavailableException(
      'The assistant is busy right now, please try again in a few seconds.',
    );
  }
}