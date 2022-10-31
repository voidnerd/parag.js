interface LooseObject {
  [key: string]: any;
}

class Template {
  private tokenRegex = `({{|}}|\@if|@elseif|@else|\@endif|@for|@endfor)`;
  private TOKEN_TYPE: Symbol | string | null = null;
  private RENDER: Symbol = Symbol();
  private IF: string = '@if';
  private ELSEIF: string = '@elseif';
  private ELSE: string = '@else';
  private ENDIF: string = '@endif';
  private FOR: string = '@for';
  private ENDFOR: string = '@endfor';
  private source = '';
  public constructor(private template: string) {}

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
  private nextTokenEndIndex(template: string) {
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
  public parseToken(token: string, currentIndex: number, totalTokens: number) {
    switch (token) {
      case '{{':
        this.TOKEN_TYPE = this.RENDER;
        break;
      case '}}':
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
            case this.RENDER:
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
              break
          }
        } else {
          this.source += '_append(`' + token + '`);';
        }
        break;
    }

  }

  public compile(data: LooseObject) {
    let self = this;
    let code = '';
    let prepend = ' ';
    let append = '';
    const tokens = this.tokenize();

    const totalTokens = tokens.length;

    tokens.forEach((token, index, array) => {
      self.parseToken(token, index, totalTokens);
    });

    if (this.source) {
      prepend += `let _output = '';
        function _append(str){if(str) return _output += str}`;

      append += `return _output;`;
      code = prepend + this.source + append;
      return Function(`{${Object.keys(data).join(',')}}`, code);
    }
  }
}

export function render(template: string, data: LooseObject = {}) {
  const tmpl = new Template(template);
  const fn = tmpl.compile(data);
  return fn ? fn(data) : '';
}
