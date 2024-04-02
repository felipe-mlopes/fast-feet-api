import { Injectable } from '@nestjs/common';

import { AttachmentRepository } from '../repositories/attachment-repository';
import { Uploader } from '../storage/uploader';

import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  orderId: string;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
    orderId,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    });

    const attachment = Attachment.create({
      orderId: new UniqueEntityID(orderId),
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
