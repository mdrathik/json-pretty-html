/**
 * A utility class for printing json artifacts
 */
class PrintWriter {
  private buffer: string[];
  private _printSelectionEndAtNewLine: boolean;
  private indentString: string;

  constructor(indentString: string) {
    this.buffer = [];
    this.indentString = indentString;
  }

  public print(str: string) {
    this.buffer.push(str);
  }

  public newLine() {
    if (this._printSelectionEndAtNewLine) {
      this.printSelectionEnd();
      this._printSelectionEndAtNewLine = false;
    } else {
      this.buffer.push('<br>');
    }
  }

  public space() {
    this.buffer.push('&nbsp;');
  }

  public indent(len: number) {
    if (len > 0) {
      let res = '';
      for (let i = 0; i < len; i++) {
        res += this.indentString;
      }
      this.buffer.push(res);
    }
  }

  public printKey(key: string) {
    this.buffer.push('\"');
    this.buffer.push(`<span class="json-key">${key}</span>`);
    this.buffer.push('\"');
  }

  public printString(value: string) {
    this.buffer.push('\"');
    this.buffer.push(`<span class="json-string">${value}</span>`);
    this.buffer.push('\"');
  }

  public printBoolean(value: boolean) {
    this.buffer.push(`<span class="json-boolean">${value}</span>`);
  }

  public printNumber(value: number) {
    this.buffer.push(`<span class="json-number">${value}</span>`);
  }

  public printSelectionStart() {
    this.buffer.push(`</div>`);
    this.buffer.push(`<div class="json-pretty json-selected">`);
  }

  public printSelectionEnd() {
    this.buffer.push(`</div>`);
    this.buffer.push(`<div class="json-pretty">`);
  }

  public set printSelectionEndAtNewLine(value: boolean) {
    this._printSelectionEndAtNewLine = value;
  }

  public toString() {
    return this.buffer.join('');
  }
}

const printObject = (object: object, out: PrintWriter, idt: number, selection: object, options: Options): void => {
  out.print('{');
  out.newLine();
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    if (selection === value) {
      out.printSelectionStart();
    }
    out.indent(idt + 1);
    out.printKey(key);
    out.print(':');
    out.space();
    switch (typeof value) {
      case 'number':
        out.printNumber(<number>value);
        break;
      case 'boolean':
        out.printBoolean(<boolean>value);
        break;
      case 'string':
        out.printString(<string>value);
        break;
      case 'object':
        if (value === null) {
          out.print('null');
        } else if (Array.isArray(value)) {
          printArray(value, out, idt + 1, selection, options);
        } else {
          printObject(<object>value, out, idt + 1, selection, options);
        }
        break;
      case 'undefined':
        out.print('undefined');
        break;
      default:
        throw new Error(`Don''t know what to do with ${typeof value}`);
    }
    if (i < keys.length - 1) {
      out.print(',');
    }
    out.newLine();
  }
  out.indent(idt);
  out.print('}');
  if (selection === object) {
    out.printSelectionEndAtNewLine = true;
  }
};

const printArray = (array: {}[], out: PrintWriter, idt: number, selection: object, options: Options): void => {
  out.print('[');
  out.newLine();
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (selection === value) {
      out.printSelectionStart();
    }
    out.indent(idt + 1);
    switch (typeof value) {
      case 'number':
        out.printNumber(<number>value);
        break;
      case 'boolean':
        out.printBoolean(<boolean>value);
        break;
      case 'string':
        out.printString(<string>value);
        break;
      case 'object':
        if (value == null) {
          out.print('null');
        } else {
          printObject(<object>value, out, idt + 1, selection, options);
        }
        break;
      case 'undefined':
        out.print('undefined');
        break;
      default:
        throw new Error(`Don''t know what to do with ${typeof value}`);
    }
    if (i < array.length - 1) {
      out.print(',');
    }
    out.newLine();
  }
  out.indent(idt);
  out.print(']');
  if (selection === array) {
    out.printSelectionEndAtNewLine = true;
  }
};

export interface Options {
  indent: string;
}

const prettyPrint = (object: object, selection?: object, options?: Options): string => {
  const opts = Object.assign({ indent: '&nbsp;&nbsp;' }, options);
  const out = new PrintWriter(opts.indent);
  out.print(`<div class="json-pretty">`);
  if (Array.isArray(object)) {
    printArray(object, out, 0, selection, opts);
  } else {
    printObject(object, out, 0, selection, opts);
  }
  out.print(`</div>`);
  return out.toString();
};

export default prettyPrint;
