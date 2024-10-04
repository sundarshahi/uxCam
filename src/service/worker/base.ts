/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { CollectionChange } from "@src/service/collections/Collection";
import type { DatabaseTable } from "@src/service/storage/AsyncStorage";

export default class Repository<T = any> {
  constructor(protected table: DatabaseTable<T, string>) {}

  all() {
    return this.table.toArray();
  }

  count() {
    return this.table.count();
  }

  get(id: string) {
    return this.table.get(id);
  }

  getBulk(ids: string[]) {
    return this.table.bulkGet(ids);
  }

  put(obj: T) {
    // this.change$.next({ type: "put", objects: [obj] });
    return this.table.put(obj);
  }

  putBulk(objs: T[]) {
    // this.change$.next({ type: "put", objects: objs });
    return this.table.bulkPut(objs);
  }

  async delete(id: string) {
    const item = await this.get(id);

    if (!item) {
      return;
    }

    // this.change$.next({ type: "delete", objects: [item] });
    return this.table.delete(id);
  }

  async deleteBulk(ids: string[]) {
    // const items = await this.getBulk(ids);
    // const filteredItems = items.filter((item): item is T => item !== undefined);

    // this.change$.next({ type: "delete", objects: filteredItems });
    return this.table.bulkDelete(ids);
  }

  getOthers(ids: string[]) {
    return this.table
      .where(this.table.schema.primKey.name)
      .noneOf(ids)
      .toArray();
  }

  //   observe(handler: (changes: CollectionChange<T>) => void) {
  //     return this.change$.asObservable().subscribe(handler);
  //   }
}
