var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// define what data looks like
var todoSchema = new Schema({
    username: String,
    todo: String,
    isDone: Boolean,
    hasAttachment: Boolean
});

// create model - using the schema
var Todos = mongoose.model('Todos', todoSchema);

module.exports = Todos;