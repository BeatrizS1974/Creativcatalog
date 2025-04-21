var app = angular.module("browseApp", []);

app.controller("browseCtrl", function($scope, $http) {
  $scope.products = [];
  $scope.filteredProducts = [];
  $scope.uniqueTypes = [];
  $scope.selectedType = "";
  $scope.editing = null;
  $scope.updatedProduct = {};

  // Load all products
  $http.get("/get_product")
    .then(function(response) {
      $scope.products = response.data;
      $scope.filteredProducts = response.data;

      // Extract unique types
      let types = $scope.products.map(p => p.type);
      $scope.uniqueTypes = [...new Set(types)];
    }, function(error) {
      alert("Could not fetch products. Are you logged in?");
    });

  // Filter by selected type
  $scope.filterByType = function() {
    if ($scope.selectedType === "") {
      $scope.filteredProducts = $scope.products;
    } else {
      $scope.filteredProducts = $scope.products.filter(p => p.type === $scope.selectedType);
    }
  };

  // Edit a product
  $scope.editProduct = function(product) {
    $scope.editing = product._id;
    $scope.updatedProduct = angular.copy(product);
  };

  // Cancel edit
  $scope.cancelEdit = function() {
    $scope.editing = null;
    $scope.updatedProduct = {};
  };

  // Save updated product
  $scope.saveProduct = function() {
    $http.put("/edit_product", $scope.updatedProduct)
      .then(function(res) {
        if (res.data.msg === "SUCCESS") {
          alert("Product updated!");
          location.reload();
        } else {
          alert("Update failed: " + res.data.msg);
        }
      });
  };

  // Delete product
  $scope.deleteProduct = function(product) {
    if (!confirm(`Delete ${product.name}?`)) return;

    $http({
      method: 'DELETE',
      url: '/delete_product',
      data: { _id: product._id },
      headers: { "Content-Type": "application/json" }
    }).then(function(response) {
      if (response.data.msg === "SUCCESS") {
        alert("Product deleted.");
        location.reload();
      } else {
        alert("Delete failed: " + response.data.msg);
      }
    });
  };
});
