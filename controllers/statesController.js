const statesData = require('../models/statesData.json');
const State = require('../models/State');

const getAllStates = async (req, res) => {
    //Combine JSON file and DB data here
    res.json(statesData);
};

const getState = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === stateCode);
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json(state);
};

//Add functions
const getFunFacts = () => {};
const addFunFacts = () => {};
const updateFunFact = () => {};
const deleteFunFact = () => {};

module.exports = {
    getAllStates,
    getState,
    getFunFacts,
    addFunFacts,
    updateFunFact,
    deleteFunFact
};
