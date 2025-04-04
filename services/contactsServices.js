import { Contact } from "../schemas/contact.js";

export async function listContacts() {
  return await Contact.findAll();
}

export async function getContactById(id) {
  return await Contact.findByPk(id);
}

export async function addContact(data) {
  return await Contact.create(data);
}

export async function removeContact(id) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export async function updateContact(id, data) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  return await contact.update(data);
}

export async function updateStatusContact(id, { favorite }) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
}
