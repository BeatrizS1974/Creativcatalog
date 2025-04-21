var app= angular.module("addProductApp", [])

    app.controller("addProductCtrl", function($scope, $http){
        $scope.submitProduct = function(){

        if($scope.name === "" || $scope.manufacturer== "" || $scope.type == "" ||
             $scope.color == "" || $scope.location == "" || $scope.quantity == "" ){
        return;
        console.log(dog);
        }
        $http({
            method: "post",
            url: indexURL + "/add_product",
            data:{
                name:$scope.name,
                manufacturer: $scope.manufacturer,
                type:$scope.type.toLowerCase(),
                color: $scope.color,
                location: $scope.location,
                quantity: $scope.quantity
                
            }
            

        }).then(function(response){
            if(response.data.msg === "SUCCESS"){
                $scope.addResults = "Product is added!";
                $scope.name = "";
                $scope.manufacturer= "";
                $scope.type= "";
                $scope.color= "";
                $scope.location= "";
                $scope.quantity="";

            }else{
                $scope.addResults = response.data.msg;
   
            }

        }), function(err){
            console.log(err);
        }
    }
    $scope.addResults = "";
})