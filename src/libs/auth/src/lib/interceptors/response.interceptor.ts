import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import type { HttpSuccessResponse, HttpFailResponse } from '../interfaces/response.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs';

// Re-format all non-error response to fit Google JSON style
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, HttpSuccessResponse<T> | HttpFailResponse> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<HttpSuccessResponse<T> | HttpFailResponse> {
    return next.handle().pipe(
        map((data) => {
          let message = 'Request Successfully';
          let code = HttpStatus.OK;

        // Customize the message and code based on the context or data
        if (_context.switchToHttp().getResponse().statusCode === 200) {
          message = 'Successfully';
          code = 200;
        } else if (_context.switchToHttp().getResponse().statusCode === 400) {
          message = 'Invalid request';
          code = 400;
        }

        return {
          message,
          code,
          data,
        };
        }),
        catchError((error) => {
            // Format error responses
            let message = 'Internal server error';
            let code = HttpStatus.INTERNAL_SERVER_ERROR;

            if (error instanceof HttpException) {
              message = error.message;
              code = error.getStatus();
            }
    
            const errorResponse: HttpFailResponse = {
              message: message,
              code: code,
              data: [],
            };

            return throwError(() => new HttpException(errorResponse, code));
         }),
        );
    }
}