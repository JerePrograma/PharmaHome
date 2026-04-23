import { openDB } from 'idb';
import type { Medicamento } from '../types';

const DB_NAME = 'pharmahome-db';
const STORE = 'medicamentos';

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    }
  });
}

export const medicamentoRepo = {
  async list(): Promise<Medicamento[]> {
    const db = await getDb();
    const all = (await db.getAll(STORE)) as Medicamento[];
    return all.sort((a, b) => a.ordenManual - b.ordenManual);
  },
  async save(m: Medicamento) {
    const db = await getDb();
    await db.put(STORE, m);
  },
  async saveMany(items: Medicamento[]) {
    const db = await getDb();
    const tx = db.transaction(STORE, 'readwrite');
    await Promise.all(items.map((item) => tx.store.put(item)));
    await tx.done;
  },
  async delete(id: string) {
    const db = await getDb();
    await db.delete(STORE, id);
  },
  async clear() {
    const db = await getDb();
    await db.clear(STORE);
  }
};
