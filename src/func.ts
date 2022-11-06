import * as path from 'path';
import { renderFile } from './parag';
import { Cache } from './utils';

export interface Options {
  filePath?: string;
}

/**
 * Func class returned by Template.compile().
 * It contains all properties and methods needed for evaluation
 */
export default class Func {
  private data!: Record<any, any>;
  public fn!: (data: Record<any, any>) => string;
  constructor(private src: string, private options: Options = {}) {}
  private readonly tagsToReplace: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  /** Escape html tags as entities */
  private escape(str: string): string {
    const self = this;
    return String(str).replace(/[&<>]/g, (tag) => {
      return self.tagsToReplace[tag] || tag;
    });
  }

  public setData(data: Record<any, any>): void {
    this.data = data;
  }

  private include(filePath: string, data: Record<any, any> = {}): string {
    if (!this.options.filePath) {
      throw new Error('Main template path not provided');
    }
    const templateDirName = path.dirname(this.options.filePath);

    const partIncludePath = path.resolve(templateDirName, filePath);

    const fullIncludePath = `${partIncludePath}.parag`;

    const mergedData = { ...this.data, ...data };

    return renderFile(fullIncludePath, mergedData);
  }

  public compile(): Func {
    /** Pass data keys as variable names to Function */
    this.fn = Function(`{${Object.keys(this.data).join(',')}}`, this.src).bind(this);
    return this;
  }

  public exec(): string {
    const result = this.fn(this.data);
    Cache.set(this.options.filePath, this);
    return result;
  }
}
