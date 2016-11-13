var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', '$http', '$timeout', function ($scope, $filter, $http, $timeout) {

    // populate todo list
    $scope.initFirst = function () {
        $http.get('http://localhost:3000/api/todos/')
            .success(function (data) {
                // 'todos' is the array that gets looped to display each todo
                $scope.todos = data;
            })
            .error(function (data, status) {
                console.log(data);
            });            
    }

    // options for isDone
    $scope.isDoneOptions = [
        { value: true, label: 'Complete' },
        { value: false, label: 'Incomplete' }
    ];

    // options for hasAttachment
    $scope.hasAttachmentOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

    // assign value to select element option value
    $scope.selectActiveOption = function (currentTodo) {
        if(currentTodo.isDone === false) {
            currentTodo.isDone = $scope.isDoneOptions[1];
        } else if(currentTodo.isDone === true) {
            currentTodo.isDone = $scope.isDoneOptions[0];
        }

        if(currentTodo.hasAttachment === false) {
            currentTodo.hasAttachment = $scope.hasAttachmentOptions[1];
        } else if(currentTodo.hasAttachment === true) {
            currentTodo.hasAttachment = $scope.hasAttachmentOptions[0];
        }
    }

    // assign select option a boolean value
    $scope.assignOptionValue = function (currentTodo) {
        if(currentTodo.isDone.label === 'Incomplete')  {
            currentTodo.isDone = false;
        }else if(currentTodo.isDone.label === 'Complete') {
            currentTodo.isDone = true;
        }

        if(currentTodo.hasAttachment.label === 'No')  {
            currentTodo.hasAttachment = false;
        }else if(currentTodo.hasAttachment.label === 'Yes') {
            currentTodo.hasAttachment = true;
        }
    }

    //////////////////////////////////
    // Confirmation Message
    //////////////////////////////////
    $scope.confirmationMessage = function (msg) {
        $scope.alertText = msg;
        $timeout(function() {
            // start angular digest cycle
            $scope.$apply(function () {
                $scope.alertText = '';
            })
        }, 1500);
    }

    //////////////////////////////////
    // Add Todo
    //////////////////////////////////
    $scope.addTodo = function (todo) {

        // assign options a boolean value
        $scope.assignOptionValue(todo);

        var request = $http.post('http://localhost:3000/api/todo', todo);

            request.success(function (data, status) {
                console.log('Status ' + status);
                if (status === 200) {
                     $scope.todos = data;
                     $scope.confirmationMessage('Success');
                     // clear input field value for each object value on $scope.newTodo form
                     if($scope.newTodo) {
                        Object.keys($scope.newTodo).map(function (todo) {
                            return $scope.newTodo[todo] = '';
                        });
                     }
                     $scope.initFirst();
                }
            })
            request.error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            });
    }

    //////////////////////////////////
    // Duplicate Todo entry
    //////////////////////////////////
    $scope.duplicate = function () {

        // new object to hold duplicated info
        $scope.duplicatedTodo = {};

        // remove _id string so api endpoint will not update the existing todo, instead create a new todo
        $scope.duplicatedTodo._id = '';
        $scope.duplicatedTodo.username = this.todo.username;
        $scope.duplicatedTodo.todo = this.todo.todo;
        $scope.duplicatedTodo.isDone = this.todo.isDone;
        $scope.duplicatedTodo.hasAttachment = this.todo.hasAttachment;

        // add todo
        $scope.addTodo($scope.duplicatedTodo);

    }

    //////////////////////////////////
    // Edit Todo
    //////////////////////////////////
    $scope.edit = function () {
        console.log('Editing');
        $scope.editTodo = {};
        $scope.editTodo.id = this.todo._id;
        $scope.editTodo.username = this.todo.username;
        $scope.editTodo.todo = this.todo.todo;
        $scope.editTodo.isDone = this.todo.isDone;
        $scope.editTodo.hasAttachment = this.todo.hasAttachment;

        // select pertaining select element option value
        $scope.selectActiveOption($scope.editTodo);
    }

    //////////////////////////////////
    // Submit Editted Todo
    //////////////////////////////////
    $scope.submitEdit = function () {
        console.log('Submitting Edit');

        // assign option a boolean value
        $scope.assignOptionValue($scope.editTodo);

        var request = $http.post('http://localhost:3000/api/todo', $scope.editTodo);

            request.success(function (data, status) {
                console.log('Status ' + status);
                if (status === 200) {
                     $scope.todos = data;
                     $scope.confirmationMessage('Edit Successful');

                     // select pertaining select element option value
                     $scope.selectActiveOption($scope.editTodo);

                     // new todo list
                     $scope.initFirst();

                    // close modal
                     $timeout(function() {
                        $('#editModal').modal('hide');
                     }, 1500);
                }
            })
            request.error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            });
    }

    //////////////////////////////////
    // Confirm Deletion of Todo
    //////////////////////////////////
    $scope.confirmDeletion = function () {
        $scope.confirmDeleteId = this.todo._id;
        $scope.confirmDeleteTask = this.todo.todo;
        $scope.confirmDeleteMessage = 'Are you sure you want to delete this todo?';
    }

    //////////////////////////////////
    // Delete Todo
    //////////////////////////////////
    $scope.removeTodo = function(id) {
        $http({ url: 'http://localhost:3000/api/todo/', 
                method: 'DELETE', 
                data: {id: $scope.confirmDeleteId}, 
                headers: {"Content-Type": "application/json;charset=utf-8"}
        }).then(function(res) {
            console.log(res.data);
            $scope.confirmationMessage('Delete Successful');
            $scope.confirmDeleteMessage = '';
            $scope.initFirst();
        }, function(error) {
            console.log(error);
        });
    }

}]);