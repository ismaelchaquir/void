import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ListenerService {
  @OnEvent('ns-media-mimes')
  handleMediaMimesHook(
    mimeExtensions: Record<string, string>,
  ): Record<string, string> {
    // Add a custom MIME type
    mimeExtensions['webp'] = 'image/webp';
    return mimeExtensions;
  }

  @OnEvent('ns-media-image-ext')
  handleImageMimesHook(
    imageMimes: Record<string, string>,
  ): Record<string, string> {
    // Further customize image MIME types
    delete imageMimes['gif']; // Remove GIFs, for example
    return imageMimes;
  }
}

