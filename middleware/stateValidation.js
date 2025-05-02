//Imports the data from JSON file
const statesData = require('../models/statesData.json');

//Function to validate state param
const stateValidation = (req, res, next) => {
    
    const stateParam = req.params.state;

    //Returns error if no param provided
    if(!stateParam) return res.status(400).json({message: "State parameter required"});

    //Will convert state code to uppercase so it matches the JSON file
    const stateCode = stateParam.toUpperCase();


    //creates a list of state codes
    const validCodes = statesData.map(state => state.code);

    //finds the matching state in JSON
    const sameState = statesData.find(state => state.code === stateCode);
    if(!sameState) {
        return res.status(400).json({message: 'Invalid state code'});
    }
    //attaches state and code to request
    req.state = sameState;
    req.stateCode = stateCode;

    //moves to the next controller
    next();
    
}

module.exports = stateValidation;