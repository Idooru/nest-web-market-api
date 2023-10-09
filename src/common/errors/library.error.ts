export class LibraryError {
  response: {
    errorCase: string;
    libraryName: string;
    message: string;
    type?: string;
  };
}
