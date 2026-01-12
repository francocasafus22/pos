export interface MemoryMulterFile extends Express.Multer.File {
  buffer: Buffer;
}
