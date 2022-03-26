import { ApiProperty } from '@nestjs/swagger';

export class FindVinylByNameAndAuthorNamePayloadDto {
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @ApiProperty({ type: String, description: 'authorName' })
  authorName: string;
}
