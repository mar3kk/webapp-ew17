const express = require('express');
const router = express.Router();
const dsController = require('../controllers/ds_controller');

/* GET home page. */
router.post('/*', function(req, res, next) {
    res.sendStatus(204);
    next();
});

router.post('/color_changed', dsController.onColorChanged);
router.post('/conveyor_state_changed', dsController.onConveyorStateChanged);

module.exports = router;
