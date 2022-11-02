import * as fs from 'fs';

class Template {
  private tokenRegex = `({{!|!}}|{{|}}|\@if|@elseif|@else|\@endif|@for|@endfor)`;
  private TOKEN_TYPE: Symbol | string | null = null;
  private readonly ESCAPE: Symbol = Symbol();
  private readonly RAW: Symbol = Symbol();
  private readonly IF: string = '@if';
  private readonly ELSEIF: string = '@elseif';
  private readonly ELSE: string = '@else';
  private readonly ENDIF: string = '@endif';
  private readonly FOR: string = '@for';
  private readonly ENDFOR: string = '@endfor';

  private source = '';

  public constructor(private template: string) {}

  /** Escape html tags as entities */
  private escape(str: string): string {
    let tagsToReplace: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };
    return String(str).replace(/[&<>]/g, function (tag) {
      return tagsToReplace[tag] || tag;
    });
  }

  /** Prepare template for parsing */
  private tokenize(): Array<string> {
    let temp: string = this.template;
    const tokens = [];
    const regex = new RegExp(this.tokenRegex);
    let result = regex.exec(temp);
    while (result) {
      let searchIndex = result.index;
      let token = result[0];
      if (searchIndex !== 0) {
        tokens.push(temp.substring(0, searchIndex));
        temp = temp.slice(searchIndex);
      }
      tokens.push(token);
      temp = temp.slice(token.length);
      switch (token) {
        case this.IF:
        case this.ELSEIF:
        case this.FOR:
          const nextToken = temp.substring(0, this.nextTokenEndIndex(temp));
          tokens.push(nextToken);
          temp = temp.slice(nextToken.length);
          break;
        default:
          break;
      }
      result = regex.exec(temp);
    }

    /**If there's nothing to tokenize, then it's one giant array element */
    if (temp) {
      tokens.push(temp);
    }
    return tokens;
  }

  /**
   * Use to get tokens fter an @if or @else token
   * For example, say we have @if(2 > 1)
   * this function will help get "(2 > 1)"
   * @param template
   * @returns index +1
   */
  private nextTokenEndIndex(template: string): number {
    for (let i = 0; i < template.length; i++) {
      if (template[i] === ')') {
        return i + 1;
      }
    }

    throw new Error('Closing bracket for @ statement not found');
  }

  /**
   * Parse template tokens to javascript
   */
  private parseToken(token: string, currentIndex: number, totalTokens: number): void {
    switch (token) {
      case '{{':
        this.TOKEN_TYPE = this.ESCAPE;
        break;
      case '}}':
        this.TOKEN_TYPE = null;
        break;
      case '{{!':
        this.TOKEN_TYPE = this.RAW;
        break;
      case '!}}':
        this.TOKEN_TYPE = null;
        break;
      case this.IF:
        this.TOKEN_TYPE = this.IF;
        break;
      case this.ELSEIF:
        this.TOKEN_TYPE = this.ELSEIF;
        break;
      case this.ELSE:
        this.source += `} else { `;
        this.TOKEN_TYPE = null;
        break;
      case this.ENDIF:
      case this.ENDFOR:
        this.source += `}`;
        this.TOKEN_TYPE = null;
        break;
      case this.FOR:
        this.TOKEN_TYPE = this.FOR;
        break;
      default:
        if (this.TOKEN_TYPE) {
          switch (this.TOKEN_TYPE) {
            case this.ESCAPE:
              this.source += ` _append(this.escape(${token}));`;
              break;
            case this.RAW:
              this.source += ` _append(${token});`;
              break;
            case this.IF:
              this.source += `if ${token} {`;
              this.TOKEN_TYPE = null;
              break;
            case this.ELSEIF:
              this.source += `} else if ${token} {`;
              this.TOKEN_TYPE = null;
              break;
            case this.FOR:
              this.source += `for ${token} {`;
              this.TOKEN_TYPE = null;
              break;
          }
        } else {
          this.source += '_append(`' + token + '`);';
        }
        break;
    }
  }

  public compile(data: Record<any, any>): Function {
    let self = this;
    let code = '';
    let prepend = ' ';
    let append = '';
    const tokens = this.tokenize();

    const totalTokens = tokens.length;

    tokens.forEach((token, index, array) => {
      self.parseToken(token, index, totalTokens);
    });

    prepend += `let _output = '';
        function _append(str){if(str) return _output += str}`;

    append += `return _output;`;
    code = prepend + this.source + append;
    /** Pass data keys as variable names to Function */
    return Function(`{${Object.keys(data).join(',')}}`, code).bind(this);
  }
}

export function render(template: string, data: Record<any, any> = {}): string {
  const tmpl = new Template(template);
  return tmpl.compile(data)(data);
}

export function renderFile(filePath: string, data: Record<any, any> = {}): string {
  const template = fs.readFileSync(filePath).toString();
  const tmpl = new Template(template);
  return tmpl.compile(data)(data);
}
