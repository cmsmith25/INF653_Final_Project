const express = require('express');
const router = express.Router();
const stateValidation = require('../middleware/stateValidation');
const statesController = require('../controllers/statesController' );



//Route for getting all states
router.route('/')
    .get(statesController.getAllStates);


//Routes to get specific data
router.route('/:state/capital')
    .get(stateValidation, statesController.getCapital);


router.route('/:state/nickname')
    .get(stateValidation, statesController.getNickname);

router.route('/:state/population')
    .get(stateValidation, statesController.getPopulation);

router.route('/:state/admission')
    .get(stateValidation, statesController.getAdmission);



//Routes to handle CRUD operations
router.route('/:state/funfact')
    .get(stateValidation, statesController.getFunFacts)  //Gets a random fun fact
    .post(stateValidation, statesController.addFunFacts) //Adds a fact
    .patch(stateValidation, statesController.updateFunFact)  //updates a fact
    .delete(stateValidation, statesController.deleteFunFact); //deletes a fact

//TEMP TEST
router.get('/debug/mongo', async (req, res) => {
    const State = require('../models/State'); // Ensure the model is loaded
    try {
        const all = await State.find();
        res.json(all);
    } catch (err) {
        console.error('Debug route error:', err);
        res.status(500).json({ message: 'Error accessing MongoDB' });
    }
});

//Route to get one state data
router.route('/:state')
    .get(stateValidation, statesController.getState);



module.exports = router;