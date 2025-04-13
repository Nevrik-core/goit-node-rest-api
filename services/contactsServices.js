import { Contact } from "../models/contact.js";

export async function listContacts(ownerId) {
  return await Contact.findAll({ where: { owner: ownerId } });
}

export async function getContactById(id, ownerId) {
  return await Contact.findOne({ where: { id, owner: ownerId } });
}

export async function addContact(data, ownerId) {
  return await Contact.create({ ...data, owner: ownerId });
}

export async function removeContact(id, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export async function updateContact(id, data, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!contact) return null;
  return await contact.update(data);
}

export async function updateStatusContact(id, { favorite }, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
}
