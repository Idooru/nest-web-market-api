export class SetDeleteMediaFilesDto<I, V> {
  images?: I[];
  videos?: V[];
  mediaEntity: string;
  option?: string;
  callWhere: "cancel upload" | "remove media entity";
}
