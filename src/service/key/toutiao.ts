import KeyService from './KeyService';
import Axios from '../Axios';
import { newsFormat } from '../../utils';

export default class test extends KeyService {
  public rule: RegExp;
  constructor() {
    super();
    this.rule = /^今日头条/;
  }

  description(): string {
    return `[今日头条]`;
  }
  async parse(text: string): Promise<string> {
    let response = await Axios.getAxiosInstance().get(`https://www.toutiao.com/api/pc/feed/?category=news_hot&utm_source=toutiao&widen=1&max_behot_time=0&max_behot_time_tmp=0&tadrequire=true`);
    if (!response) return '';
    let { data } = response;
    if (!data || !(data instanceof Array)) return '';
    let result = {
      name: '今日头条',
      items: data.slice(0, 5).map(d => {
        return {
          title: d.title,
          url: `https://www.toutiao.com${d.source_url}`
        };
      })
    };
    return newsFormat(result);
  }
}
