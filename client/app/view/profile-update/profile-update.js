angular.module('myApp.profileUpdate', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile-update/:name', {
    authenticate: true,
    templateUrl: 'view/profile-update/profile-update.html',
    controller: 'profileUpdatePage',
    resolve: {
      getProfile: ['$route', 'User', function($route, User) {
        return User.getProfile($route.current.params.name);
      }]
    }
  });
}])

.controller('profileUpdatePage', ['$scope', '$location', 'Cookie', '$cookies', 'UserForm', 'getProfile', function($scope, $location, Cookie, $cookies, UserForm, getProfile) {

  $scope.user = getProfile;
  console.log(getProfile);

  var cookie = $cookies.get('gitConnectDeltaKS');
  var cookieObj = Cookie.parseCookie(cookie);

  var user = {
    name: cookieObj.username,
    githubId: cookieObj.id,
    picture: cookieObj.avatar,
    languages: ['JavaScript', 'AngularJS', 'Sass', 'CSS', 'HTML', 'Firebase']
  };

  $scope.user = user;

  $scope.techList = [
    'JavaScript', 'AngularJS', 'Sass', 'CSS', 'HTML', 'Firebase',
    'Ruby', 'Less', 'Scala', 'Python', 'C++', 'Swift', 'Objective-C',
    'mongoDB', 'Neo4j', 'MySQL', 'SQLite', 'Shell', 'Redis', 'Meteor',
    'jQuery', 'Java', 'Rails', 'React', 'PHP', 'PostgreSQL', 'Node.js',
    'Express', 'Stylus', 'Symfony', 'Wordpress', 'Zend', 'socket.io',
    'Backbone', 'Boostrap', 'Foundation', 'CoffeeScript', 'Bower', 'Django',
    'ActionScript', 'Ember', 'Go', 'Gulp', 'Grunt', 'Laravel', 'Docker'
  ];

  // Remove user existing tech
  $scope.initialTech = function() {
    setTimeout(function () { 
      user.languages.forEach(function(element) {
        var index = $scope.techList.indexOf(element);
         $scope.techList.splice(index, 1); 
         $scope.$apply();
      }) 
    }, 100);
  };

  $scope.addTech = function(tech, index) {
    if (user.languages.indexOf(tech) !== -1) {
      $scope.techList.splice(index, 1); 
    } else {
      user.languages.push(tech); 
      $scope.techList.splice(index, 1);
      $scope.searchText = '';
    }
  }

  $scope.removeTech = function(tech, index) {
    $scope.techList.push(tech); 
    user.languages.splice(index, 1);  
  }

  $scope.formSubmit = function() {
    // var userCity = $('#user-location').val();
    var userSelectedTech = user.languages;
    var userEmail = $scope.userEmail;
    var userBio = $scope.userBio;

    // Location user update form submission
    var resultsLocation = {
      username: user.name,
      cityId: cityId,
      cityName: cityName
    }
    console.log(resultsLocation);
    // Get User techs list
    var resultsTech = userSelectedTech;

    // Prepare email and Bio data
    var userInfos = {
      username: user.name,
      email: userEmail,
      bio: userBio
    }

    // Prepare data to be posted
    var postData = {
      resultsLocation : resultsLocation,
      resultsTech: resultsTech,
      userInfos: userInfos
    }

    // Posting data
    UserForm.postForm(postData)

    // Redirection to the home page
    $location.path('/');
  }

  $scope.googleMapInit = function() {
    // google.maps.event.addDomListener(window, 'load', addressInitialize);
    addressInitialize();
  }

  function addressInitialize() {
    var input = document.getElementById('user-location');
    var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function() {
      // Get city name only
      var place = autocomplete.getPlace();
      console.log(place.name, place.place_id);

      cityId = place.place_id;
      cityName = place.name;
      // $('#user-location').val(place.name);
    });
  }

}]);