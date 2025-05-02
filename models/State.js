const mongoose = require('mongoose');

//Defines a schema for the state docuemnt
const stateSchema = new mongoose.Schema({
    stateCode: {
        type: String, //State's abbreviation
        required: true, //Needs to be provided
        unique: true, //Cannot duplicate
        uppercase: true //convert to uppercase
    },

    funfacts: {
    type: [String], //Gives an array of strings
    default: [] //Will ensure that my funfacts are an array
}
});

module.exports = mongoose.model('State', stateSchema, 'StatesDB');