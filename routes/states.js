const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');


//Prelim router stuff
router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(statesController.getState);


router.route('/:state/funfact')
    .get(statesController.getFunFacts)
    .post(statesController.addFunFacts)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

module.exports = router;