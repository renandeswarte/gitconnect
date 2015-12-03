angular.module('myApp.projectpage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/project/:id', {
    authenticate: true,
    templateUrl: 'view/project-page/project-page.html',
    controller: 'projectPage',
    resolve: {
      getProject: ['$route', 'Project', function($route, Project) {
        return Project.getInfos($route.current.params.id);
      }],
      getUsers: ['$route', 'Project', function($route, Project) {
        return Project.getUsers($route.current.params.id);
      }],
      getLanguages: ['$route', 'Project', function($route, Project) {
        return Project.getLanguages($route.current.params.id);
      }]
    }
  });
}])

.controller('projectPage', ['$scope', '$cookies', 'Cookie', 'socket', '$rootScope', 'getProject', 'getUsers', 'getLanguages', function($scope, $cookies, Cookie, socket, $rootScope, getProject, getUsers, getLanguages) {

  var cookie = $cookies.get('gitConnectDeltaKS');
  var cookieObj = Cookie.parseCookie(cookie);
  $scope.username = cookieObj.username;
  $scope.avatar = cookieObj.avatar;
  $scope.currentTime;
  $scope.messages = [];

  $scope.init = function() {
    $scope.myproject = getProject.project;
    $scope.myproject.teams = getUsers.users;
    var techList = getLanguages.languages;
    socket.emit('initProject', {
      name: $scope.username,
      projectRoom: $scope.myproject.projectId
    });
    $scope.displayName = getOwnName();
    $scope.myproject.languages = [];

    techList.forEach(function(tech) {
      $scope.myproject.languages.push({
        name:tech.name,
        nameEncoded: encodeURIComponent(tech.name)
      });
    });
  }

  var getOwnName = function() {
    for(var i = 0; i < $scope.myproject.teams.length; i++) {
      if($scope.myproject.teams[i].username === $scope.username) {
        $scope.actualName = $scope.myproject.teams[i].name;
        return $scope.actualName + '(' + $scope.username + ')';
      }
    }
  }
  

  // $scope.increment = function(project, index){
  //   project.upVote += 1;
  // }

  // $scope.decrement = function(project, index){
  //   project.downVote += 1;
  // }

  /** Socket Listeners **/

 

  // listen to initializer
  socket.on('initProject', function(data) {
    if(data[$scope.myproject.projectId]) {
      $scope.messages = data[$scope.myproject.projectId];
    }
  })

  //listens to sent message
  socket.on('send:projectMessage' , function(data) {
    $scope.messages.push(data);
  })

  $scope.messageSubmit = function(){
    if($scope.text){
    var currentTime = new Date();
      socket.emit('send:projectMessage', {
        room: $scope.myproject.projectId,
        message: $scope.text,
        date: currentTime,
        name: $scope.displayName,
        avatar: $scope.avatar
      })

   
      $scope.messages.push({
        username: $scope.username,
        message: $scope.text,
        date: currentTime,
        avatar: $scope.avatar
      });
      var roomObj = {};
      roomObj[$scope.myproject.projectId] = $scope.messages;
      socket.emit('store:projectData', angular.copy(roomObj));

      $scope.text = "";
    }
  }

}]);