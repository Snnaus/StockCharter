'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {
    $scope.stockSearch = {
      Normalized: false,
      NumberOfDays: 150,
      DataPeriod: 'Day',
      Elements: []
    };
    
    $scope.stocks = {};
    $scope.addStock = '';
    $scope.currStocks = [];
    $scope.showGraph = false;
    
    $scope.addElement = function(input, obj, stocks){
      if(input){
        input = input.toUpperCase();
        obj.Elements.push({
          Symbol: input,
          Type: 'price',
          Params: ['c']
        });
        $('#addInput').val('');
        lookupStocks(obj);
      }
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
          $scope.currStocks = [];
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus);
        }
        
      });
    };
    
    var renderGraph = function(){
      if($scope.stocks.Elements){
        var input = $scope.stocks;
        var newStock = input.Elements.map(function(stock){ return stock.Symbol }).filter(function(stock){ return $scope.currStocks.indexOf(stock) === -1 });
        if(newStock.length > 0){
          $scope.currStocks = input.Elements.map(function(stock){ return stock.Symbol });
          var graph = {
            chart: {
              type: 'line'
            },
            title: {
              text: "Stock prices over the last 150 days"
            },
            yAxis: {
              title: "Price"
            },
            series: input.Elements.map(function(ele){
              return {
                name: ele.Symbol,
                data: ele.DataSeries.close.values
              };
            })
        };
          $('#container').highcharts(graph);
          console.log(graph);
          $scope.showGraph = true;
        }
      }
    };
    
    var timer = $interval(renderGraph, 100);
    $scope.$on('$destroy', function(){
      $interval.cancel(timer);
    });
    
    $scope.removeStock = function(stockSym, search){
      var index = search.Elements.map(function(stock){return stock.Symbol}).indexOf(stockSym);
      var garbage = search.Elements.splice(index, 1);
      lookupStocks(search);
      console.log(search, $scope.stocks);
    };
    
  });
