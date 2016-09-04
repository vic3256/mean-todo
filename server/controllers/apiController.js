var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');

module.exports = function (app) {
	
	// allow api to parse json
	app.use(bodyParser.json());
	// allow api to parse encoded url's
	app.use(bodyParser.urlencoded({ extended: true }));


	// get all todos
	app.get('/api/todos/', function (req, res) {
		
		Todos.find({ }, 
			function (err, todos) {
				if(err) throw err;

				res.send(todos);
		});

	});

	// get all todos for particular user
	app.get('/api/todos/:uname', function (req, res) {
		
		Todos.find({ username: req.params.uname }, 
			function (err, todos) {
				if(err) throw err;

				res.send(todos);
		});

	});

	// find individual todo by id
	app.get('/api/todo/:id', function (req, res) {
		
		Todos.findById({ _id: req.params.id },
			function (err, todo) {
				if(err) throw err;

				res.send(todo);
		});

	});

	// find and update todos
	app.post('/api/todo', function (req, res) {
		// if request body has an id item already exists so update
		if(req.body.id) {
			Todos.findByIdAndUpdate(req.body.id, { todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function (err, todo) {
				if(err) throw err;

				res.send('Success');
			});
		}

		// otherwise create new object if no id present
		else {

			// mongoose new model object
			var newTodo = Todos({
				username: req.body.username,
				todo: req.body.todo,
				isDone: req.body.isDone,
				hasAttachment: req.body.hasAttachment
			});

			// save to db
			newTodo.save(function (err) {
				if(err) throw err;

				// res.send('!!!Success-express');
			});

			// send back updated list
			Todos.find({ }, 
				function (err, todos) {
					if(err) throw err;

					res.send(todos);
			});

		}

	});

	// delete todo
	app.delete('/api/todo', function (req, res) {
		
		Todos.findByIdAndRemove(req.body.id, function (err) {
			if(err) throw err;
			console.log('Deleted ' + req.body.id);
			res.send('Success');
		});

	});



	// delete todo by param id
	// app.delete('/api/todo/:id', function (req, res) {
	// 	var id = req.params.id;

	// 	console.log(id);
	// });


}