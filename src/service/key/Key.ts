import KeyService from './KeyService';

class Key {
  private loaders: KeyService[];
  constructor() {
    this.loaders = [];
  }

  use(keySrv: KeyService) {
    this.loaders.push(keySrv);
  }

  async parse(text: string): Promise<string> {
    let l;

    for (const x of this.loaders) {
      if (x && x.rule.test(text)) {
        return await x.parse(text);
      }
    }
    return '';
  }
}

export default Key;