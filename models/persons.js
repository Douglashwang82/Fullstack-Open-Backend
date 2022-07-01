const mongoose = require('mongoose');
const url = process.env.URL;

console.log('connecting to MongoDB');

mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB:',err.message));

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    number:{
        type:String,
        validate: function(v){
            const pattern1 = /^\d{2,3}-\d+$/;
            const pattern2 = /^.{9,}$/;
            return pattern1.test(v) && pattern2.test(v);
        },
        message: `Number Validation fail.`,
        required: true
    },
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Persons', personSchema);

