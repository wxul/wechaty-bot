export default abstract class KeyService {
  public abstract readonly rule: RegExp;

  abstract parse(text: string): string | Promise<string>;
  /**
   *
   *
   *
   *
   */
  abstract description(): string;
}
