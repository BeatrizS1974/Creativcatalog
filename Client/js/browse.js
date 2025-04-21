var app = angular.module("browseApp", []);

app.controller("browseCtrl", function($scope, $http) {
  $http.get("/get_product")
    .then(function(response) {
      $scope.products = response.data;
    }, function(error) {
      alert("Could not fetch products. Are you logged in?");
    });

  $scope.editProduct = function(product) {
    alert("Edit not implemented yet. You clicked: " + product.name);
  };

  $scope.deleteProduct = function(product) {
    alert("Delete not implemented yet. You clicked: " + product.name);
  };
});

