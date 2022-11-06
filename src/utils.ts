export const Cache: any = {
  _data: {},
  set(key: string, val: any): void {
    this._data[key] = val;
  },
  get(key: string): string {
    return this._data[key];
  },
  remove(key: string): void {
    delete this._data[key];
  },
};
