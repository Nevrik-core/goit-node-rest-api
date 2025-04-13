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
    const contacts = await listContacts(req.user.id);
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact || contact.owner !== req.user.id) {
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
    const contact = await getContactById(id);

    if (!contact || contact.owner !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    await contact.destroy();
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact({ name, email, phone }, req.user.id);
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

    const contact = await getContactById(id);

    if (!contact || contact.owner !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    const updated = await contact.update(data);
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

    const contact = await getContactById(id);

    if (!contact || contact.owner !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    contact.favorite = favorite;
    await contact.save();

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};
