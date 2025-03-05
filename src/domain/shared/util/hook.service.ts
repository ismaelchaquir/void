import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HookService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit a filter event and return the processed value
   */
  filter<T>(hookName: string, value: T): T {
    const listeners = this.eventEmitter.listeners(hookName);
    if (listeners.length === 0) {
      return value; // If no listeners are registered, return the original value
    }

    // Create a reference to store the modified value
    let modifiedValue = value;

    // Emit the event
    this.eventEmitter.emit(hookName, modifiedValue);

    return modifiedValue;
  }
}
