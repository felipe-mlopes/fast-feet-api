import { AttachmentRepository } from '../repositories/attachment-repository';
import { Updloader } from '../storage/uploader';

import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

interface UploadAndCreateAttachmentsUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  orderId: string;
}

type UploadAndCreateAttachmentsUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private attachmentsRepository: AttachmentRepository,
    private uploader: Updloader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
    orderId,
  }: UploadAndCreateAttachmentsUseCaseRequest): Promise<UploadAndCreateAttachmentsUseCaseResponse> {
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
