// offlineQueue.ts
import { openDB } from "idb";

const DB_NAME = "leadQueueDB";
const STORE_NAME = "queue";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function queueLead(lead: any) {
  const db = await getDB();
  await db.add(STORE_NAME, { lead });
}

export async function getQueuedLeads() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function clearQueued() {
  const db = await getDB();
  const items = await db.getAllKeys(STORE_NAME);
  for (const key of items) {
    await db.delete(STORE_NAME, key);
  }
}
