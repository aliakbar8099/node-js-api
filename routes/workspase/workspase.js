const express = require('express');
const auth = require('../../middleware/auth');

// add product
const addWork = require('../../controller/add-workspase');

const router = express.Router();

const path = '/workspase';

router.get(path+"/all", auth, addWork.getAllWork);
router.get(`${path}/:id`, addWork.getSingleWork);
router.get(`get_workspase/:id`, addWork.getSingleWork);
router.get(path , auth , addWork.get_workspase)

router.post(path+"/team", auth , addWork.team_member)

router.post(path, auth , addWork.postWork);

router.delete(`${path}/:id`, auth, addWork.deleteWork);

module.exports = router;