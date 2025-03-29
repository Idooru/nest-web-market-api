export class SetDeleteMediaFilesDto<I, V> {
  public images?: I[];
  public videos?: V[];
  public mediaEntity: string;
  public option?: string;
  public callWhere: "cancel upload" | "remove media entity";
}
