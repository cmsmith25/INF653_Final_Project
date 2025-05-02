//This will import the state data from JSON and the MongoDB model
const statesData = require('../models/statesData.json');
const State = require('../models/State');

//Combines the MongoDB fun facts with the static data from JSON
const getCombinedStateData = async () => {
    const mongoStates = await State.find();//Will retrieve all MongoDB entries
    console.log('MongoDB states', mongoStates);//Debugging
    
    //Loops through the static states and will add fun fact if one exists for the state
    return statesData.map(state =>  {
        const matchingState = mongoStates.find(s => s.stateCode === state.code);
        if (matchingState && matchingState.funfacts.length) {
            console.log(`Adding fun facts for state: ${state.code}`);
            return { ...state, funfacts: matchingState.funfacts };
        }
        return state;
    });
            
};

//GET Will retrieve all states and a fun fact from MongoDB if there is one
const getAllStates = async (req, res) => {
let states = await getCombinedStateData(); //Gets all states with fun facts

const contig = req.query.contig;
console.log('Contig query parameter:', contig);

if(contig === 'true') {
    states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    console.log('States after filtering out AK and HI:', states.map(state => state.code));
} else if (contig === 'false') {
    states = states.filter(state => state.code === 'AK' || state.code === 'HI');
}


res.json(states); //send data to clietn
};



//GET   will retrieve one state's info and fun facts
const getState = async (req, res) => {
    const state = statesData.find(s => s.code === req.stateCode); //finds the state in JSON
    if (!state) return res.status(404).json({ message: 'State not found' });
    

    //checks if state has funfacts in mongo, adds to json
    const mongoState = await State.findOne({ stateCode: req.stateCode});
    if (mongoState?.funfacts?.length) {
        state.funfacts = mongoState.funfacts;
    }

    
    res.json(state);
}

//GET   will retrieve a state and show a random fun fact
const getFunFacts = async(req, res) => {
    try{
    console.log('stateCode received:', req.stateCode); //Debugging
    const mongoEntry = await State.findOne({ stateCode: req.stateCode });
    console.log('MongoDB result:', mongoEntry);//More debugging

    //Returns error if no fun fact is found
    if (!mongoEntry || !mongoEntry.funfacts?.length) {
        return res.status(404).json({ message: `No Fun Facts found for ${req.state.state}`}); 
    }
    //Selects random fun fact from MongoDB
    const funfact = mongoEntry.funfacts[Math.floor(Math.random() * mongoEntry.funfacts.length)];
    res.json({funfact });
} catch (err) {
    console.error('Error in getFunFacts:', err);
    res.status(500).json({message: 'Server error retrieving fact'});
}
};




//POST   will add fun facts to a state
const addFunFacts = async (req,res) => {
    const { funfacts } = req.body;


//Checks if fun facts are missing
if (funfacts === undefined) {
    return res.status(400).json({message: 'State fun facts value required'})
}

//Checks for  array of fun facts
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({message: 'State fun facts value must be an array' }); 
    }

    //Add to MongoDB or create new if state unavailable
    const state = await State.findOneAndUpdate(
        {stateCode: req.stateCode },
        { $push: { funfacts: { $each: funfacts }}},
        { new: true, upsert: true }
    );
   //Returns data for updated state
    res.status(201).json(state);
};



//PATCH will update specific fun fact by the index
const updateFunFact = async (req, res) => {

    const { index, funfact} = req.body;


    //checks for index and fun fact
    if (index === undefined) {
        return res.status(400).json({message: 'State fun fact index value required'});
    }
        
    if(!funfact || typeof funfact !== 'string') {
        return res.status(400).json({ message: 'State fun fact value required'});
    }
    
    //Does state exist in DB?
    const state = await State.findOne({ stateCode: req.stateCode });


    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Fact found for ${stateName}`});
    }

    //Index validation
    if(index < 0 || index >= state.funfacts.length) {
        return res.status(404).json({message: `No Fun Fact found at that index for ${stateName}`});
    }


    //updates fact at index
    state.funfacts[index] = funfact;
    await state.save();

    res.json(state);
};




//DELETE will remove a fun fact by index
const deleteFunFact = async (req, res) => {
    //makes state code uppercase
    const stateCode = req.params.state.toUpperCase();
    const { index } = req.body;

    //checks for index
    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required'});
    }

    //finds the state in MongoDB
    const state = await State.findOne({ stateCode });

    //Index validation
    if (!state || !state.funfacts || state.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateCode}`});
    }

    const arrayIndex = index - 1;//will adjust index from 1 to 0 base for test

    //checks if index is in the array
    if (arrayIndex < 0 || arrayIndex >= state.funfacts.length) {
        return res.status(404).json({message: `No Fun Fact found at that index for ${stateCode}`});
    }

    //Deletes the fun fact
    state.funfacts.splice(arrayIndex, 1);
    await state.save();//saves update

    res.json(state);
};

const getCapital = (req,res) => {
    const state = statesData.find(s => s.code === req.stateCode);

    if(!state) return res.status(404).json({message: 'State not found'});
    res.json({state: state.state, capital: state.capital_city});
}

const getNickname = (req,res) => {
    const state = statesData.find(s => s.code === req.stateCode);
    if(!state) return res.status(404).json({message: 'State not found'});

    res.json({state: state.state, nickname: state.nickname});
}


const getPopulation = (req,res) => {
    const state = statesData.find(s => s.code === req.stateCode);
    if(!state) return res.status(404).json({message: 'State not found'});

    res.json({state: state.state, population: state.population.toLocaleString()});
}


const getAdmission = (req,res) => {
    const state = statesData.find(s => s.code === req.stateCode);
    if(!state) return res.status(404).json({message: 'State not found'});
    res.json({state: state.state, admitted: state.admission_date});
}

//exports functions to use in Routes
module.exports = {
    getAllStates,
    getState,
    getFunFacts,
    addFunFacts,
    updateFunFact,
    deleteFunFact,
    getCapital, 
    getNickname,
    getPopulation,
    getAdmission
};
