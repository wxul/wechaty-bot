/**
 * DFA实现敏感词过滤
 */

import fs, { readFileSync, statSync, readdirSync } from "fs";
import { join } from "path";

type CharType = Map<string, CharType> | false;

export default class SensitiveWord {
  private _wordsMap: Map<string, CharType>;

  constructor() {
    this._wordsMap = new Map();
  }

  private _readFilePath(filePath: string): string {
    const stat = statSync(filePath);
    if (stat.isFile() && /\.txt$/.test(filePath)) {
      return readFileSync(filePath, { encoding: "utf-8" });
    } else if (stat.isDirectory()) {
      const files = readdirSync(filePath);
      let content = "";
      files.forEach(f => {
        content += "\n" + this._readFilePath(join(filePath, f));
      });
      return content;
    } else {
      return "";
    }
  }

  buildMapFromFile(filePath: string) {
    let f = this._readFilePath(filePath);
    this.buildMap(f);
  }

  buildMap(file: string) {
    let m = new Map<string, CharType>();
    let count = 0;
    let temp = m; // 指针
    while (count < file.length) {
      const char = file[count];
      if (char === "\n" || char === "\r") {
        count++;
        if (temp !== m) {
          temp.set("eol", false);
        }
        temp = m;
        continue;
      }
      if (temp.has(char)) {
        temp = temp.get(char) || new Map();
      } else {
        let newChar = new Map<string, CharType>();
        temp.set(char, newChar);
        temp = newChar;
      }
      count++;
    }

    this._wordsMap = m;
  }

  filterText(text: string) {
    let count = 0;
    let filtedWords: string[] = [];

    let tempChar = "";
    let tempMap = this._wordsMap;

    while (count < text.length) {
      const char = text[count];

      if (tempMap.has(char)) {
        // 有匹配
        tempChar += char;
        tempMap = tempMap.get(char) || new Map();
        // 如果end
        if (tempMap.has("eol")) {
          filtedWords.push(tempChar);
          tempChar = "";
          tempMap = this._wordsMap;
        }
      } else {
        tempChar = "";
        tempMap = this._wordsMap;
      }
      count++;
      continue;
    }

    return filtedWords;
  }
}

export const SensitiveWordInstance = new SensitiveWord();
