const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1);
}

const password = process.argv[2];
const databasename = "phonebook";
const url = `mongodb+srv://douglas:${password}@cluster0.qns08.mongodb.net/${databasename}?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
const Persons = mongoose.model('Persons', personSchema);

if (process.argv.length === 3) {
    console.log('show all data in the database');
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected');
            Persons.find({})
                .then(result => {
                    result.forEach(person => {
                        console.log(person);
                    })
                    mongoose.connection.close();
                })
        })
    return;
}


const name = process.argv[3];
const number = process.argv[4];

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected');

        const person = new Persons({
            name:name,
            number: number,
        })

        return person.save();
    })
    .then(() => {
        console.log('person saved!');
        return mongoose.connection.close();
    })
    .catch((err) => console.log(err));

