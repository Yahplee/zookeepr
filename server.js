const express = require("express");
const { animals } = require("./data/animals");

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

app.post("/api/animals", (req, res) => {
	res.json(req.body);
});

app.listen(3001, () => {
	console.log(`API server now on port 3001!`);
});
