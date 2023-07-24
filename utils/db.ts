import PouchDB from 'pouchdb';

const db = new PouchDB('users');

PouchDB.sync('users', 'http://admin:password@0.0.0.0:5984/users', {
  live: true,
  retry: true,
});

export default db;

export const getAllUsers = async () => {
  const result = await db.allDocs({ include_docs: true, attachments: true });
  return result.rows.map((row) => row.doc);
};
