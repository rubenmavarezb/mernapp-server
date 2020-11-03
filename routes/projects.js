const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Creating an user
//api/projects
router.post('/',
    auth,
    [
        check('name', 'Name of the project is required').not().isEmpty()
    ],
    projectController.createProject 
);

//Get projects
router.get('/',
    auth,
    projectController.getProjects 
);

//Act project
router.put('/:id',
    auth,
    projectController.actProject
);

//Delete project
router.delete('/:id',
    auth,
    projectController.deleteProject
)

module.exports = router;
