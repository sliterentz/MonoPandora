import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { PaginationRequest } from '../interfaces';
// import { ErrorType } from '../types';

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T>({ limit, page = 1, skip }: PaginationRequest, totalRecords: number, dtos: T[]): PaginationResponseDto<T> {
    try {
      const totalPages = Math.floor(totalRecords / limit) + (totalRecords % limit > 0 ? 1 : 0);
      const currentPage = +page > 0 ? +page : 1;
      const hasNext = currentPage <= totalPages - 1;
      
      return {
        // message: 'Request Successfully',
        // code: 200,
        totalPages: totalPages,
        payloadSize: dtos.length,
        hasNext: hasNext,
        data: dtos,
        currentPage: currentPage,
        skippedRecords: skip,
        totalRecords: totalRecords,
      };

    } catch (error) {
      return {
        // message: ErrorType.NoUserDataExists,
        // code: 400,
        totalPages: 0,
        payloadSize: 0,
        hasNext: false,
        data: [],
        currentPage: 0,
        skippedRecords: 0,
        totalRecords: 0,
      };
    }

  }
}
