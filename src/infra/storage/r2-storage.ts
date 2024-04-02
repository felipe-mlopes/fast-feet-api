import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { EnvService } from '../env/env.service';

import {
  Uploader,
  UploadParams,
} from '@/domain/delivery/application/storage/uploader';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    const accontId = envService.get('CLOUDFLARE_ACCOUNT_ID');

    this.client = new S3Client({
      endpoint: `https://${accontId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFilename = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFilename,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFilename,
    };
  }
}
