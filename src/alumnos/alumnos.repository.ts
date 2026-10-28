import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DYNAMO_CLIENT } from '../dynamodb/dynamodb.module';

export interface Alumno {
  alumnoId: string;
  nombre: string;
  apellido: string;
  email: string;
}

@Injectable()
export class AlumnosRepository {
  private readonly tableName: string;

  constructor(
    @Inject(DYNAMO_CLIENT) private readonly db: DynamoDBDocumentClient,
    config: ConfigService,
  ) {
    this.tableName = config.getOrThrow<string>('TABLE_NAME');
  }

  async create(alumno: Alumno): Promise<Alumno> {
    await this.db.send(
      new PutCommand({
        TableName: this.tableName,
        Item: alumno,
        ConditionExpression: 'attribute_not_exists(alumnoId)',
      }),
    );
    return alumno;
  }

  async findAll(): Promise<Alumno[]> {
    const items: Alumno[] = [];
    let lastKey: Record<string, any> | undefined;
    do {
      const res = await this.db.send(
        new ScanCommand({
          TableName: this.tableName,
          ExclusiveStartKey: lastKey,
        }),
      );
      items.push(...((res.Items ?? []) as Alumno[]));
      lastKey = res.LastEvaluatedKey;
    } while (lastKey);
    return items;
  }

  async findOne(alumnoId: string): Promise<Alumno | undefined> {
    const res = await this.db.send(
      new GetCommand({ TableName: this.tableName, Key: { alumnoId } }),
    );
    return res.Item as Alumno | undefined;
  }

  async update(
    alumnoId: string,
    changes: Partial<Omit<Alumno, 'alumnoId'>>,
  ): Promise<Alumno | undefined> {
    const entries = Object.entries(changes).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      return this.findOne(alumnoId);
    }

    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    const sets: string[] = [];
    entries.forEach(([key, value], i) => {
      names[`#k${i}`] = key;
      values[`:v${i}`] = value;
      sets.push(`#k${i} = :v${i}`);
    });

    try {
      const res = await this.db.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { alumnoId },
          UpdateExpression: `SET ${sets.join(', ')}`,
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
          ConditionExpression: 'attribute_exists(alumnoId)',
          ReturnValues: 'ALL_NEW',
        }),
      );
      return res.Attributes as Alumno;
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) return undefined;
      throw error;
    }
  }

  async remove(alumnoId: string): Promise<boolean> {
    try {
      await this.db.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { alumnoId },
          ConditionExpression: 'attribute_exists(alumnoId)',
        }),
      );
      return true;
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) return false;
      throw error;
    }
  }
}