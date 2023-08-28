/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require("./utils.js");

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

app.post("/", async (req, res) => {
	const contactId = req.body.contacts.add[0].id;	
	const contact = await api.getContact(contactId);	
	const age = utils.getAge(contact);
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
	};
	await api.updateContacts([updatedContact]);
});