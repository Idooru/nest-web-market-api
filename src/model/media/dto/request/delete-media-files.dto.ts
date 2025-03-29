export class DeleteMediaFilesDto {
  public imageFiles: {
    fileName: string[];
    imagePrefix: string;
  };
  public videoFiles: {
    fileName: string[];
    videoPrefix: string;
  };
}
