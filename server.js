const express = require("express");
const { animals } = require("./data/animals");
const fs = require("fs");
const path = require("path");

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
	let personalityTraitsArray = [];

	// creating filter so that we can search by only 1 trait within an Arr
	let filteredResults = animalsArray;

	if (query.personalityTraits) {
		if (typeof query.personalityTraits === "string") {
			personalityTraitsArray = [query.personalityTraits];
		} else {
			personalityTraitsArray = query.personalityTraits;
		}
		personalityTraitsArray.forEach((trait) => {
			filteredResults = filteredResults.filter(
				(animal) => animal.personalityTraits.indexOf(trait) !== -1
			);
		});
	}

	// query for name, die, and species
	if (query.diet) {
		filteredResults = filteredResults.filter(
			(animal) => animal.diet === query.diet
		);
	}
	if (query.species) {
		filteredResults = filteredResults.filter(
			(animal) => animal.species === query.species
		);
	}
	if (query.name) {
		filteredResults = filteredResults.filter(
			(animal) => animal.name === query.name
		);
	}
	return filteredResults;
}

// function for animal id with filter
function findById(id, animalsArray) {
	const result = animalsArray.filter((animal) => animal.id === id)[0];
	return result;
}

function createNewAnimal(body, animalsArray) {
	const animal = body;
	animalsArray.push(animal);
	fs.writeFileSync(
		// write to our animals.json directory, so we use path.join() to join the value of __dirname
		path.join(__dirname, "./data/animals.json"),
		// nedto save js array as json, so we stringify
		// null means we dont want to edit any of our existing data
		// 2 means the white space between our values
		JSON.stringify({ animals: animalsArray }, null, 2)
	);
	return animal;
}

function validateAnimal(animal) {
	if (!animal.name || typeof animal.name !== "string") {
		return false;
	}
	if (!animal.species || typeof animal.species !== "string") {
		return false;
	}
	if (!animal.diet || typeof animal.diet !== "string") {
		return false;
	}
	if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
		return false;
	}
	return true;
}

app.get("/api/animals", (req, res) => {
	let results = animals;

	if (req.query) {
		results = filterByQuery(req.query, results);
	}
	res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
	const result = findById(req.params.id, animals);

	if (result) {
		res.json(result);
	} else {
		res.send(404);
	}
});

// add validation to ensure we are POSTing the correct syntax
app.post("/api/animals", (req, res) => {
	req.body.id = animals.length.toString();

	// if any data in req.body is incorrect, send 400 error back
	if (!validateAnimal(req.body)) {
		res.status(400).send("The animal is not properly formatted.");
	} else {
		const animal = createNewAnimal(req.body, animals);
		res.json(animal);
	}
});

app.listen(3001, () => {
	console.log(`API server now on port 3001!`);
});
