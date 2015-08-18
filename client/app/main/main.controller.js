'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $interval, socket) {
    $scope.stockSearch = {
      Normalized: false,
      NumberOfDays: 150,
      DataPeriod: 'Day',
      Elements: []
    };
    
    $scope.stocks = {};
    $scope.addStock = '';
    $scope.currStocks = [];
    $scope.saveStocks = [];
    $scope.showGraph = false;
    $http.get('/api/stockSyms').success(function(stocks){
      $scope.saveStocks = stocks;
      $scope.stockSearch.Elements = stocks.map(function(stock){ return stock.elem });
      lookupStocks($scope.stockSearch);
      socket.syncUpdates('stockSym', $scope.saveStocks, function(event, item, object){
        $scope.stockSearch.Elements = object.map(function(stock){ return stock.elem });
        if(object.length){
          lookupStocks($scope.stockSearch);
        }else{
          $scope.showGraph = false;
          $scope.stocks = {};
        }
      });
    });
    
    $scope.addElement = function(input, stocks){
      if(input){
        input = input.toUpperCase();
        var obj = {
          Normalized: false,
          NumberOfDays: 150,
          DataPeriod: 'Day',
          Elements: []
        }, newElem = {
          Symbol: input,
          Type: 'price',
          Params: ['c']
        };
        
        obj.Elements.push(newElem);
        obj = {
          parameters: JSON.stringify(obj)
        };
        $.ajax({
        data: obj,
        url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
        dataType: 'jsonp',
        context: this,
        success: function(result){
          if(!result || result.Message){
            console.error("Error: ", result.Message);
          }
          $http.post('/api/stockSyms', {name: input, elem: newElem});
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus);
        }
        
      });
        
        $('#addInput').val('');
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
              text: " "
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
          $scope.showGraph = true;
        }
      }
    };
    
    var timer = $interval(renderGraph, 100);
    $scope.$on('$destroy', function(){
      $interval.cancel(timer);
    });
    
    $scope.removeStock = function(stockSym, stocks){
      var id = stocks[stocks.map(function(stock){ return stock.elem.Symbol }).indexOf(stockSym)]._id;
      $http.delete('/api/stockSyms/'+id);
    };
    
  });
