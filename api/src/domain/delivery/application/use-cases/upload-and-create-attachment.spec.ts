import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';

import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';

import { FakeUploader } from 'test/storage/fake-uploader';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an attachment', async () => {
    const orderID = new UniqueEntityID();

    const result = await sut.execute({
      orderId: orderID.toString(),
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an attachment with invalid file type', async () => {
    const orderID = new UniqueEntityID();

    const result = await sut.execute({
      orderId: orderID.toString(),
      fileName: 'profile.mp3',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
