interface LooseObject {
  [key: string]: any;
}

class Template {
  private tokenRegex = `({{|}}|\@if|\@endif)`;
  private TOKEN_TYPE: Symbol | null = null;
  private RENDER: Symbol = Symbol();
  private IF: Symbol = Symbol();
  private ENDIF: Symbol = Symbol();
  private FOR: Symbol = Symbol();
  private source = '';
  public constructor(private template: string) {}
  private tokenize(): Array<string> {
    let temp: string = this.template;
    const tokens = [];
    const regex = new RegExp(this.tokenRegex);
    let result = regex.exec(temp);
    while (result) {
      let searchIndex = result.index;
      let token = result[0]
      if (searchIndex !== 0) {
        tokens.push(temp.substring(0, searchIndex));
        temp = temp.slice(searchIndex);
      }
      tokens.push(token);
      temp = temp.slice(token.length);
      switch (token) {
        case "@if":
          const nextTokenAfterIf = temp.substring(0, this.nextTokenIndex(temp))
          tokens.push(nextTokenAfterIf)
          temp = temp.slice(nextTokenAfterIf.length);
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

  private nextTokenIndex(template:string) {
    for(let i = 0; i < template.length; i++) {
      if(template[i] === ")") {
        return i + 1
      }
    }

    throw new Error("Closing bracket for @ statement not found")
  }

  public parseToken(token: string, currentIndex: number, totalTokens: number) {
    switch (token) {
      case '{{':
        this.TOKEN_TYPE = this.RENDER;
        break;
      case '}}':
        this.TOKEN_TYPE = null;
        break;
      case '@if':
        this.TOKEN_TYPE = this.IF;
        break;
      case '@endif':
        if(currentIndex === totalTokens - 1) {
          this.source += `}`;
        }
        this.TOKEN_TYPE = this.ENDIF;
        break;
      default:
        if (this.TOKEN_TYPE) {
          switch (this.TOKEN_TYPE) {
            case this.RENDER:
              this.source += ` _append(${token});`;
              break;
            case this.IF:
              this.source += `\nif ${token} {\n`;
              this.TOKEN_TYPE = null
              break;
            case this.ENDIF:
              this.source += `}`;
              this.TOKEN_TYPE = null
              break;
          }
        } else {
          this.source += "_append(`" + token+ "`);";
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

    const totalTokens = tokens.length

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
