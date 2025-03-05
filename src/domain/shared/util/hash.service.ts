import * as bcrypt from 'bcrypt';

export class HashService {
  async hashData(data: string): Promise<string> {
    try {
      const saltRounds = 10;
      return bcrypt.hash(data, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async verifyData(data: string, hashedData: string): Promise<boolean> {
    try {
      return bcrypt.compare(data, hashedData);
    } catch (error) {
      throw error;
    }
  }
}
