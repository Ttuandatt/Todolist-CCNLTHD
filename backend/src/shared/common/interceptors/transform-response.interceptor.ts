import {
  Injectable, // Used for dependency injection
  NestInterceptor, // Used for intercepting HTTP requests and responses
  ExecutionContext, // Used for accessing request and response objects
  CallHandler, // Used for handling HTTP requests and responses
} from '@nestjs/common';
import { Observable } from 'rxjs'; // Used for handling HTTP requests and responses
import { map } from 'rxjs/operators'; // Used for mapping HTTP requests and responses

// ===== PHẦN 2: INTERFACE =====
// Define the response object
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// ===== PHẦN 3: INTERCEPTOR =====
// Implement the interceptor
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
