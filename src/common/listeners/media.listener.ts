import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MediaExtensionPlugin {
  @OnEvent('media-mimes')
  handleMediaMimesHook(
    mimeExtensions: Record<string, string>,
  ): Record<string, string> {
    // Add a custom MIME type
    mimeExtensions['webp'] = 'image/webp';
    mimeExtensions['mkv'] = 'image/mkv';
    return mimeExtensions;
  }

  @OnEvent('media-image-ext')
  handleImageMimesHook(
    imageMimes: Record<string, string>,
  ): Record<string, string> {
    // Further customize image MIME types
    delete imageMimes['gif']; // Remove GIFs, for example
    return imageMimes;
  }
}

