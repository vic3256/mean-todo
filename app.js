var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', '$http', '$timeout', function ($scope, $filter, $http, $timeout) {

    // populate todo list
    $scope.initFirst = function () {
        $http.get('http://localhost:3000/api/todos/')
            .success(function (data) {
                $scope.todos = data;
            })
            .error(function (data, status) {
                console.log(data);
            });            
    }

    // options for isDone
    $scope.isDoneOptions = [
        {
            value: true,
            label: 'Complete'
        },
        {
            value: false,
            label: 'Incomplete'
        }
    ];

    // options for hasAttachment
    $scope.hasAttachmentOptions = [
        {
            value: true,
            label: 'Yes'
        },
        {
            value: false,
            label: 'No'
        }
    ];

    // confirmation message
    $scope.confirmationMessage = function (msg) {
        $scope.alertText = msg;
        $timeout(function() {
            // start angular digest cycle
            $scope.$apply(function () {
                $scope.alertText = '';
            })
        }, 1500);
    }

    // select pertaining select element option value
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

    // assign option a boolean value
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

    // add todo
    $scope.addTodo = function () {

        // assign option a boolean value
        $scope.assignOptionValue($scope.newTodo);

        var request = $http.post('http://localhost:3000/api/todo', $scope.newTodo);

            request.success(function (data, status) {
                console.log('Status ' + status);
                if (status === 200) {
                     $scope.todos = data;
                     $scope.confirmationMessage('Add Successful');
                     // clear input value for each object value
                     Object.keys($scope.newTodo).map(function (todo) {
                         return $scope.newTodo[todo] = '';
                     });
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

    // duplicate todo entry
    $scope.duplicate = function () {
        
    }

    // edit todo
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

    // submit editted todo
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

    // confirm delete todo
    $scope.confirmDeletion = function () {
        $scope.confirmDeleteId = this.todo._id;
        $scope.confirmDeleteTask = this.todo.todo;
        $scope.confirmDeleteMessage = 'Are you sure you want to delete this todo?';
    }

    // delete todo
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