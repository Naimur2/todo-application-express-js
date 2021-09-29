const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');

// create model
const Todo = new mongoose.model('Todo', todoSchema);

// get all todos
router.get('/', async (req, res) => {
    try {
        const data = await Todo.find({ status: 'active' })
            .select({
                _id: 0,
                date: 0,
            })
            .limit(1);
        res.status(200).json({ result: data, message: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'There was aserver side error!' });
    }
});

// get a todo by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id }).select({
            _id: 0,
            date: 0,
        });

        res.status(200).json({ result: data, message: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'There was aserver side error!' });
    }
});

// post a todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    newTodo.save((err) => {
        if (err) {
            res.status(500).json({ error: 'There was aserver side error!' });
        } else {
            res.status(200).json({ message: 'Todo was saved successfully' });
        }
    });
});

// post multiple todo
router.post('/:all', async (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({ error: 'There was aserver side error!' });
        } else {
            res.status(200).json({ message: 'Todos was saved successfully' });
        }
    });
});

// update todo
router.put('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    status: 'inactive',
                },
            },
            {
                new: true,
            }
        );
        console.log(result);
        res.status(200).json({ message: 'Todo was updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'There was a server side error!' });
    }
});

// delete todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Todo was deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'There was a server side error!' });
    }
});

// export the router
module.exports = router;
