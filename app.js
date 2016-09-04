var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$filter', '$http', '$timeout', function ($scope, $filter, $http, $timeout) {

    $scope.handle = '';

    $scope.lowercasehandle = function () {
        return $filter('lowercase')($scope.handle);
    };

    $scope.characters = 5;

    $scope.initFirst = function () {

        $http.get('http://localhost:3000/api/todos/')
            .success(function (data) {
                $scope.todos = data;
            })
            .error(function (data, status) {
                console.log(data);
            });            
    }


    $scope.options = ['Complete', 'Incomplete'];

    $scope.successMessage = function (msg) {
        $scope.alertText = msg;
        $timeout(function() {
            // start angular digest cycle
            $scope.$apply(function () {
                $scope.alertText = '';
            })
        }, 2000);
    }


    $scope.addTodo = function () {
        var request = $http.post('http://localhost:3000/api/todo', $scope.newTodo);

            request.success(function (data, status) {
                console.log('Status ' + status);
                if (status === 200) {
                     $scope.todos = data;
                     $scope.successMessage('Add Successful');
                     // $scope.newTodo['username'] = '';
                     // $scope.newTodo['todo'] = '';
                     // $scope.newTodo['isDone'] = '';
                     // $scope.newTodo['hasAttachment'] = '';
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

    $scope.confirmDeletion = function () {
        $scope.confirmDeleteId = this.todo._id;
        $scope.confirmDeleteTask = this.todo.todo;
        $scope.confirmDeleteMessage = 'Are you sure you want to delete this todo?';
    }

    $scope.removeTodo = function(id) {
        $http({ url: 'http://localhost:3000/api/todo/', 
                method: 'DELETE', 
                data: {id: $scope.confirmDeleteId}, 
                headers: {"Content-Type": "application/json;charset=utf-8"}
        }).then(function(res) {
            console.log(res.data);
            $scope.successMessage('Delete Successful');
            $scope.confirmDeleteMessage = '';
            $scope.initFirst();
        }, function(error) {
            console.log(error);
        });
    }

}]);