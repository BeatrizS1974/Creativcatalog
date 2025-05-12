var app = angular.module("addProductApp", []);

app.controller("addProductCtrl", function($scope, $http) {
  $scope.addResults = "";

  $scope.submitProduct = function() {
    if (
      !$scope.name ||
      !$scope.manufacturer ||
      !$scope.type ||
      !$scope.color ||
      !$scope.location ||
      !$scope.quantity
    ) {
      alert("Please fill out all fields.");
      return;
    }

    $http.post("/add_product", {

      name: $scope.name,
      manufacturer: $scope.manufacturer,
      type: $scope.type.toLowerCase(),
      color: $scope.color,
      location: $scope.location,
      quantity: $scope.quantity
    }, {
      withCredentials: true
    })

    .then(function(response) {
      if (response.data.success){
        $scope.addResults = "Product added!";
        $scope.name = "";
        $scope.manufacturer = "";
        $scope.type = "";
        $scope.color = "";
        $scope.location = "";
        $scope.quantity = "";
      } else {
        $scope.addResults = response.data.message || "Save failed.";
      }
    }, function(err) {
      console.log(err);
    });
  };

  // --- Scanner functionality is commented out below ---
  /*
  $scope.startScanner = function() {
    var scannerElement = document.getElementById('scanner');
    scannerElement.style.display = 'block';

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerElement,
        constraints: { facingMode: "environment" }
      },
      decoder: {
        readers: ["upc_reader", "ean_reader"]
      }
    }, function(err) {
      if (err) {
        console.error(err);
        alert('Error initializing scanner: ' + err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(function(result) {
      var scannedUPC = result.codeResult.code;
      console.log("Scanned UPC:", scannedUPC);

      Quagga.stop();
      scannerElement.style.display = 'none';
      document.getElementById('loading-spinner').style.display = 'block';

      fetch(indexURL + '/scannedUPC', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upc: scannedUPC })
      })
      .then(response => response.json())
      .then(() => console.log("✅ UPC sent to server"))
      .catch(error => console.error('Error sending UPC:', error));

      fetch('https://api.upcitemdb.com/prod/trial/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upc: scannedUPC })
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('loading-spinner').style.display = 'none';

        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          let color = '';

          if (item.description) {
            const colorMatch = item.description.match(/Color:\s*([a-zA-Z\/\- ]+)/i);
            if (colorMatch && colorMatch[1]) {
              color = colorMatch[1];
            }
          }

          $scope.$apply(function() {
            $scope.name = item.title || '';
            $scope.manufacturer = item.brand || '';
            $scope.type = item.category || '';
            $scope.color = color;
            $scope.location = '';
            $scope.quantity = 1;
          });

          alert('Product info loaded!');
        } else {
          alert('Product not found in UPC database.');
        }
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        document.getElementById('loading-spinner').style.display = 'none';
        alert('Failed to fetch product details.');
      });
    });

    setInterval(function() {
      fetch(indexURL + '/getLatestUPC')
        .then(response => response.json())
        .then(data => {
          if (data.upc) {
            console.log("New UPC received:", data.upc);
            document.getElementById('name').value = data.upc;

            fetch(indexURL + '/scannedUPC', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ upc: null })
            });
          }
        })
        .catch(error => console.error('Error checking for UPC:', error));
    }, 1000);
  };
  */
});
