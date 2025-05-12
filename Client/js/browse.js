var app = angular.module("browseApp", []);

app.controller("browseCtrl", function($scope, $http) {
  $scope.products = [];
  $scope.filteredProducts = [];
  $scope.uniqueTypes = [];
  $scope.selectedType = "";
  $scope.editing = null;
  $scope.updatedProduct = {};

  // Load all products
  $http.get("products", { withCredentials: true })
    .then(function(response) {
      $scope.products = response.data;
      $scope.filteredProducts = response.data;

      // Extract unique types
      let types = $scope.products.map(p => p.type);
      $scope.uniqueTypes = [...new Set(types)];
    }, function(error) {
      alert("Could not fetch products. Are you logged in?");
    });

  // ✅ Angular-based search
  $scope.performSearch = function () {
    const category = document.getElementById('search-category').value;
    const query = document.getElementById('search-query').value.trim();

    if (!query) {
      $scope.filteredProducts = $scope.products;
      return;
    }

  $http.post("/search", {
  category,
  query
}, {
  withCredentials: true
})
      .then(function (response) {
        $scope.filteredProducts = response.data;
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });
  };
  $scope.clearSearch = function () {
    document.getElementById('search-query').value = '';
    $scope.filteredProducts = $scope.products;
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
  $http.put("/update_product/" + $scope.updatedProduct._id, $scope.updatedProduct)
    .then(function(res) {
      if (res.data.success) {
        alert("Product updated!");
        location.reload();
      } else {
        alert("Update failed: " + res.data.message);
      }
    })
    .catch(function(err) {
      console.error("Update error:", err);
      alert("An error occurred while updating the product.");
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
      if (response.data.success) {
  alert("Product deleted.");
  location.reload();
} else {
  alert("Delete failed: " + response.data.message);

      }
    });
  };
});
