'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {
    $scope.stockSearch = {
      Normalized: false,
      NumberOfDays: 15,
      DataPeriod: 'Day',
      Elements: []
    };
    
    $scope.stocks = {};
    $scope.addStock = '';
    $scope.currStocks = [];
    
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
              text: "Stock prices over the last 15 days"
            },
            xAxis: {
              categories: input.Elements.map(function(ele){ return ele.Symbol })
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
        }
      }
    };
    
    var timer = $interval(renderGraph, 100);
    $scope.$on('$destroy', function(){
      $interval.cancel(timer);
    });
  });
