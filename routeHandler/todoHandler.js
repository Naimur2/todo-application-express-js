const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');

// create model
const Todo = new mongoose.model('Todo', todoSchema);

// get all todos
router.get('/', async (req, res) => {});

// get a todo by id
router.get('/:id', async (req, res) => {});

// post a todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save((err) => {
        if (err) {
            res.status(500).json({ error: 'There was aserver side error!' });
        } else {
            res.status(200).json({ message: 'Todo was saved successfully' });
        }
    });
});

// post multiple todo
router.post('/:all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({ error: 'There was aserver side error!' });
        } else {
            res.status(200).json({ message: 'Todos was saved successfully' });
        }
    });
});

// update todo
router.put('/:id', async (req, res) => {
    const update = Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: 'inactive',
            },
        },
        {},
        (err) => {
            if (err) {
                res.status(500).json({ error: 'There was a server side error!' });
            } else {
                res.status(200).json({ message: 'Todo was updated successfully' });
            }
        }
    );
    console.log(update);
});

// delete todo
router.delete('/:delete', async (req, res) => {});

// export the router
module.exports = router;
