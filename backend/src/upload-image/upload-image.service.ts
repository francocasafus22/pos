import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './upload-image.response';
import { createReadStream } from 'streamifier';
import { MemoryMulterFile } from './types/memory-multer-file.type';

@Injectable()
export class UploadImageService {
  uploadFile(file: MemoryMulterFile): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        },
      );
      const { buffer } = file;

      if (!buffer) {
        return reject(new Error('File buffer is missing'));
      }

      createReadStream(buffer).pipe(uploadStream);
    });
  }
}
