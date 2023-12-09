import { toast } from "react-toastify";

export class connectToIndexedDB {
    private db: IDBDatabase | null = null;

    constructor(readonly dbName: string, readonly dbVersion: number) {}

    connect(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if(this.db) {
                resolve(this.db);
            } else {
                const request = window.indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = (e) => {
                    reject((e.target as IDBOpenDBRequest).error);
                }

                request.onsuccess = (e) => {
                    this.db = (e.target as IDBOpenDBRequest).result;
                    resolve(this.db);
                }

                request.onupgradeneeded = (e) => {
                    const db = (e.target as IDBOpenDBRequest).result;
                    db.createObjectStore('audio', { autoIncrement: true });
                }
            }
        });
    }

    addData(key: string, audioData: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                const transaction = db.transaction(['audio'], 'readwrite');
                const objectStore = transaction.objectStore('audio');

                const checkIfBlobAlreadyExists = objectStore.get(key);

                checkIfBlobAlreadyExists.onsuccess = (e) => {
                    if((e.target as any).result !== undefined) {
                        toast.error('Música já está baixada');
                    } else {
                        const request = objectStore.add(audioData, key);

                        request.onsuccess = () => {
                            resolve(`${key} downloaded`);
                            toast.success(`Música ${key} baixada com sucesso`);
                        };

                        request.onerror = (event) => {
                            reject(`Error while adding audio file: ${(event.target as IDBRequest).error}`);
                        };
                    }
                }
                
                checkIfBlobAlreadyExists.onerror = (e) => {
                    reject(`Error while checking if blob exists: ${(e.target as IDBRequest).error}`);
                }
            });
        });
    }

    checkIfKeyExists(key: string): Promise<boolean | Blob> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.connect();
                const transaction = db.transaction(['audio'], 'readwrite');
                const objectStore = transaction.objectStore('audio');
                
                const getKey = objectStore.get(key);

                getKey.onsuccess = (e) => {
                    const result = (e.target as any).result;
                    resolve(result !== undefined ? result : false);
                }

                getKey.onerror = (err) => {
                    reject(`Error while getting get: ${err}`);
                }
            } catch (err) {
                reject(err);
            }
        })
    }

    getAllKeys(): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.connect();
                const transaction = db.transaction(['audio'], 'readonly');
                const objectStore = transaction.objectStore('audio');

                const getAllKeysRequest = objectStore.getAllKeys();

                getAllKeysRequest.onsuccess = (e) => {
                    const keys = (e.target as any).result;
                    resolve(keys);
                };

                getAllKeysRequest.onerror = (err) => {
                    reject(`Error while getting all keys: ${err}`);
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    deleteKey(key: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.connect();
                const transaction = db.transaction(['audio'], 'readwrite');
                const objectStore = transaction.objectStore('audio');

                const deleteRequest = objectStore.delete(key);

                deleteRequest.onsuccess = () => {
                    resolve();
                    toast.success(`Música ${key} excluída com sucesso`);
                };

                deleteRequest.onerror = (err) => {
                    reject(`Error while deleting key: ${err}`);
                };
            } catch (err) {
                reject(err);
            }
        });
    }
}