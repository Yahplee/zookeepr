const express = require("express");
const { animals } = require("./data/animals");

const app = express();

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

app.get("/api/animals", (req, res) => {
	let results = animals;

	if (req.query) {
		results = filterByQuery(req.query, results);
	}

	res.json(results);
});

// to get the animal through id in particular
app.get("/api/animals/:id", (req, res) => {
	const result = findById(req.params.id, animals);
	if (result) {
		res.json(result);
	} else {
		res.send(404);
	}
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`API server now on port 3001!`);
});
