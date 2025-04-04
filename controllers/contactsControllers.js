import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!Object.keys(data).length) {
      throw HttpError(400, "Body must have at least one field");
    }

    const updated = await updateContactService(id, data);
    if (!updated) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      throw HttpError(400, "Missing or invalid field 'favorite'");
    }

    const updated = await updateStatusContact(id, { favorite });

    if (!updated) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
