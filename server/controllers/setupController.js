var Todos = require('../models/todoModel');

module.exports = function (app) {
    
    app.get('/api/setupTodos', function (req, res) {
        // seed database
        var starterTodos = [
            {
                username: 'test',
                todo: 'Buy Milk',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'test',
                todo: 'Buy Cereal',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'test',
                todo: 'Learn Node',
                isDone: false,
                hasAttachment: false
            }
        ];

        // mogoose created model
        Todos.create(starterTodos, function (err, results) {
            res.send(results);
        });

    });

}