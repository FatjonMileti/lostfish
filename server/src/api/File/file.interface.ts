export interface FileService {
  uploadFile(file: any): Promise<string>;
  uploadFiles(files: any[]): Promise<any>;
  getFile(fileName: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
