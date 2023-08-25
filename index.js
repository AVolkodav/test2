/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const { default: axios } = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	app.get("/ping", (req, res) => res.send("pong " + Date.now()));

	app.post("/hook", (req, res) => {
		console.log(req.data);
		res.send("OK");
	});

	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});


const contactAgeFieldId = 1163127;
const contactBirthDateFieldId = 1160897;
const utils = require('./utils.js')

app.post('/', async (req, res) => {
	const contactId = req.body.contacts.add[0].id;	
	const contact = await api.getContact(contactId);	
	const birthDate = 1000 * utils.getFieldValue(contact.custom_fields_values, contactBirthDateFieldId);
	const age = Math.trunc((Date.now() - birthDate)/1000/60/60/24/365.25);
	const updatedContact = {
		id: contact.id,
		custom_fields_values: [
			{
				field_id: contactAgeFieldId,
				values: [
					{
						value: age
					}
				]
			}
		]
	} 
	await api.updateContacts([updatedContact]);
});