import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  // @ApiProperty({ example: 'Request Successfully' })
  // message!: string;
  // @ApiProperty({ example: 200 })
  // code!: number;
  @ApiProperty({ example: 1 })
  currentPage!: number;
  @ApiProperty({ example: 0 })
  skippedRecords!: number;
  @ApiProperty({ example: 1 })
  totalPages!: number;
  @ApiProperty({ example: false })
  hasNext!: boolean;
  @ApiProperty()
  data!: T[];
  @ApiProperty({ example: 1 })
  payloadSize!: number;
  @ApiProperty({ example: 1 })
  totalRecords!: number;
}