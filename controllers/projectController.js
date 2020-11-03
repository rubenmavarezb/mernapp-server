const Project = require('../models/Project')
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {

    //Check for errors
    const isError = validationResult(req);
    if(!isError.isEmpty()){
        return res.status(400).json({error: isError.array()})
    }

    try {

        //Creating new project
        const project = new Project(req.body);

        project.creator = req.user.id;
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hay un error')
    }
}

//Getting all projects from actual user

exports.getProjects = async (req, res) => {
    try {
       const projects = await Project.find({ creator: req.user.id }).sort({created: -1});
       res.json({ projects });
    } catch (error) {
        console.log(error)
        res.status(500).send('There is an error')

    }
}

//act user's projects
exports.actProject = async (req, res) => {
    //Check for errors
    const isError = validationResult(req);
    if(!isError.isEmpty()){
        return res.status(400).json({error: isError.array()})
    }

    //extract project info
    const { name } = req.body;
    const newProject = {};

    if(name){
        newProject.name = name;
    }

    try {
        //check Id
        let project = await Project.findById(req.params.id);

        //if project exists or not
        if(!project){
            return res.status(400).json({msg: 'Could not find the project'})
        }
        //verify project's creator
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Not authorized'})
        }

        //act
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true});

        res.json({project})

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
}

//Deleting user's project from id
exports.deleteProject = async (req, res) => {
    try {
        //check Id
        let project = await Project.findById(req.params.id);

        //if project exists or not
        if(!project){
            return res.status(400).json({msg: 'Could not find the project'})
        }
        //verify project's creator
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Not authorized'})
        }
        
        //Delete project
        await Project.findOneAndRemove({_id: req.params.id});
        res.json({ msg: 'Project deleted'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error in server')
    }
}