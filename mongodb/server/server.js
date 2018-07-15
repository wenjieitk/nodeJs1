const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {port} = require('./config/env');
const {mongoose} = require('./db/mongoose');
const{Todo} = require('./models/todo');
const{User} = require('./models/user');

let app = express();

//middleWare
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    },(error) => {
        res.status(400).send(error);
        console.log('unable to save \n ' + error);
    });
});

app.get('/todos', (req,res)=>{
    Todo.find().then((todos) => {
        res.send({todos})
    },(error) => {
        res.status(400).send(e);
    });
});

// GET /todos/request
app.get('/todos/:id', (req,res) => {
    let id = req.params.id;    

    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID format');
    }

    Todo.findById(id).then((todos) => {
        if(!todos){
            return res.status(404).send('no results');
        }

        res.send({todos});

    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.delete('/todos/:id',(req,res) => {
    /**
     * get the id
     * validate the id
     * remove todo by id
     * - success
     *      -if no doc, send 404
     *      -if doc, send doc back with 200
     * - error
     *  - 400 with empty body
     */

     let id = req.params.id;
     
     if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID format');
    }

    // Todo.findOneAndRemove({_id:id}).then((todo) => {
    //     if(!todo){
    //         return res.status(404).send();
    //     }        

    //     res.send({todo});
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((error) => {
        res.status(400).send(error);
    });
});


app.listen(port,() => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};