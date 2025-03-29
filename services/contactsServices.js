import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function readDB() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
}

export async function listContacts() {
  return await readDB();
}

export async function getContactById(id) {
  const contacts = await readDB();
  return contacts.find((c) => c.id === id) || null;
}

export async function removeContact(id) {
  const contacts = await readDB();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const [removed] = contacts.splice(index, 1);
  await writeDB(contacts);
  return removed;
}

export async function addContact({ name, email, phone }) {
  const contacts = await readDB();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await writeDB(contacts);
  return newContact;
}

export async function updateContact(id, data) {
  const contacts = await readDB();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await writeDB(contacts);
  return contacts[index];
}
