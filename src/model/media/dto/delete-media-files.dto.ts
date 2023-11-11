export class DeleteMediaFilesDto {
  imageFiles: {
    fileName: string[];
    imagePrefix: string;
  };
  videoFiles: {
    fileName: string[];
    videoPrefix: string;
  };
}
