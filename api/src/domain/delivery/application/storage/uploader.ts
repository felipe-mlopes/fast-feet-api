export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Updloader {
  abstract upload(params: UploadParams): Promise<{ url: string }>;
}
