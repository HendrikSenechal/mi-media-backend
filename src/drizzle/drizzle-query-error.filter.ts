import type { ExceptionFilter } from '@nestjs/common';
import { Catch, ConflictException, NotFoundException } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';

@Catch(DrizzleQueryError)
export class DrizzleQueryErrorFilter implements ExceptionFilter {
  catch(error: DrizzleQueryError) {
    if (!error.cause || !('code' in error.cause)) {
      throw new Error(error.message || 'Unknown database error');
    }

    const {
      cause: { code },
    } = error;

    switch (code) {
      case 'ER_DUP_ENTRY':
        throw new ConflictException('This item already exists');
      case 'ER_NO_REFERENCED_ROW_2':
        throw new NotFoundException('A referenced item does not exist');
    }

    throw error;
  }
}
