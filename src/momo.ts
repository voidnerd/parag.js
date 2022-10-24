interface LooseObject {
  [key: string]: any;
}

class Template {
  private tokenRegex = '({{|}})';
  private mode: string | null = null;
  private source = '';
  public constructor(private template: string) {}
  public tokenize(): Array<string> {
    let temp: string = this.template;
    const tokens = [];
    const regex = new RegExp(this.tokenRegex);
    let result = regex.exec(temp);

    while (result) {
      let searchIndex = result.index;
      if (searchIndex !== 0) {
        tokens.push(temp.substring(0, searchIndex));
        temp = temp.slice(searchIndex);
      }
      tokens.push(result[0]);
      temp = temp.slice(result[0].length);
      result = regex.exec(temp);
    }
    if (temp) {
      tokens.push(temp);
    }
    return tokens;
  }

  public parseToken(token: string) {
    switch (token) {
      case '{{':
        this.mode = 'eval';
        break;
      case '}}':
        this.mode = null;
        break;
      default:
        if (this.mode) {
          this.source += `; _append(${token})`;
        } else {
          this.source += `; _append("${token}")`;
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

    tokens.forEach((token) => {
      self.parseToken(token);
    });

    if (this.source) {
      prepend += `let _output = ''
        function _append(str){return _output += str}`;

      append += `; return _output;`;
      code = prepend + this.source + append;

      return Function(`{${Object.keys(data).join(',')}}`, code);
    }
  }
}

export function render(template: string, data: LooseObject = {}) {
  const tmpl = new Template(template);
  const fn = tmpl.compile(data);

  if (fn) {
    console.log(fn(data));
  }

  return fn ? fn(data) : "";
}
