import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DYNAMO_CLIENT = 'DYNAMO_CLIENT';

@Module({
  providers: [
    {
      provide: DYNAMO_CLIENT,
      useFactory: () =>
        DynamoDBDocumentClient.from(new DynamoDBClient({}), {
          marshallOptions: { removeUndefinedValues: true },
        }),
    },
  ],
  exports: [DYNAMO_CLIENT],
})
export class DynamodbModule {}