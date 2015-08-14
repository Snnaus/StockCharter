'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.stockSearch = {
      Normalized: false,
      NumberOfDays: 15,
      DataPeriod: 'Day',
      Elements: []
    };
    
    $scope.stocks = {};
    $scope.addStock = '';
    
    $scope.addElement = function(input, obj){
      input = input.toUpperCase()
      obj.Elements.push({
        Symbol: input,
        Type: 'price',
        Params: ['c']
      });
      
      lookupStocks(obj);
    };
    
    var lookupStocks = function(search){
      search = {
        parameters: JSON.stringify(search)
      };
      $.ajax({
        data: search,
        url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
        dataType: 'jsonp',
        context: this,
        success: function(result){
          if(!result || result.Message){
            console.error("Error: ", result.Message);
          }
          $scope.stocks = result;
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus);
        }
        
      });
    };
  });
