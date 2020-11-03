const Task = require('../models/Task');
const Project  = require('../models/Project');
const { validationResult} = require('express-validator')

exports.createTask = async (req, res) => {
    //Check for errors
    const isError = validationResult(req);
    if(!isError.isEmpty()){
        return res.status(400).json({error: isError.array()})
    }

    try {
        //Extract project and verify if exists
        const { project } = req.body;
        const proj = await Project.findById(project);
        if(!proj){
            return res.status(404).json({msg: 'Project not found'});
        }

        //Verify if current project is from the logged user
        if(proj.creator.toString() !== req.user.id){
            return res.status(401).json({ msg:'Not authorized'})
        }

        //Create task
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        
    }
}


exports.getTask = async (req, res) => {
    try {
        //Extract project and verify if exists
        const { project } = req.query;
        const proj = await Project.findById(project);
        if(!proj){
            return res.status(404).json({msg: 'Project not found'});
        }

        //Verify if current project is from the logged user
        if(proj.creator.toString() !== req.user.id){
            return res.status(401).json({ msg:'Not authorized'})
        }

        //Get task from projects
        const tasks = await Task.find({ project }).sort({ created: -1});
        res.json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
}

exports.updateTask = async (req, res) => {
    try {
        //Extract project and verify if exists
        const { project, name, state } = req.body;

        //if task exists
        let task = await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({ msg: 'That task does not exists'});
        }

        //Extract project
        const proj = await Project.findById(project);


        //Verify if current project is from the logged user
        if(proj.creator.toString() !== req.user.id){
            return res.status(401).json({ msg:'Not authorized'})
        }

        const newTask = {};
        newTask.name = name;
        newTask.state = state;

        //Save task
        task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, { new: true});
        res.json({ task })

    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
}

//Deleting a task
exports.deleteTask = async (req, res) => {
    try {
        //Extract project and verify if exists
        const { project } = req.query;

        //if task exists
        let task = await Task.findById(req.params.id);

        if(!task){
            return res.status(404).json({ msg: 'That task does not exists'});
        }

        //Extract project
        const proj = await Project.findById(project);


        //Verify if current project is from the logged user
        if(proj.creator.toString() !== req.user.id){
            return res.status(401).json({ msg:'Not authorized'})
        }

        //Delete task
        await Task.findOneAndRemove({_id: req.params.id})
        res.json({ msg: 'Task deleted!'})

    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error');
    }
}