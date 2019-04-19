import KeyService from './KeyService';

export class test extends KeyService {
  public rule: RegExp;
  constructor() {
    super();
    this.rule = /^test/;
  }

  description(): string {
    throw new Error('Method not implemented.');
  }
  async parse(text: string): Promise<string> {
    return '';
  }
}
