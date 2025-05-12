var app = angular.module("wishlistApp", []);

app.controller("wishlistCtrl", function($scope, $http) {
  $scope.wishlist = [];
  $scope.item = {};

  $scope.previewImage = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.item.image = e.target.result;
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  $scope.submitWishlist = function() {
    $http.post('/add_wishlist', $scope.item)
      .then(function(res) {
        if (res.data.success) {
          $scope.wishlist.push($scope.item);
          $scope.item = {}; // reset form
          alert("Added to wishlist!");
        } else {
          alert("Error: " + res.data.message);
        }
      });
  };

  function loadWishlist() {
    $http.get('/get_wishlist')
      .then(function(res) {
        $scope.wishlist = res.data;
      });
  }

  loadWishlist();
});
