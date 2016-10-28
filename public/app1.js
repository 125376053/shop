
angular.module('shopApp',['ngRoute']).config(function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'pages/home.html',
        controller:'HomeCtrl'
    }).when('/users/reg',{
        templateUrl:'pages/reg.html',
        controller:'RegCtrl'
    }).when('/users/login',{
        templateUrl:'pages/login.html',
        controller:'LoginCtrl'
    }).when('/goods/back/list',{
        templateUrl:'pages/goods/back/list.html',
        controller:'GoodsCtrl'
    }).when('/goods/front/list',{
        templateUrl:'pages/goods/front/list.html',
        controller:'GoodsCtrl'
    }).when('/cart/list',{
        templateUrl:'pages/cart/list.html',
        controller:'CartCtrl'
    }).otherwise({
        redirectTo:'/'
    });
})

angular.module('shopApp').run(function($rootScope,$location,$http){
    $http({
        url:'/users/validate',
        method:'POST'
    }).success(function(user){
        $rootScope.me = user;
        $location.path('/');
    }).error(function(data){
        $location.path('/login');
    });
});

angular.module('shopApp').controller('NavBarCtrl',function($rootScope,$scope,$location,$http){

    $scope.logout = function(){
        $http({
            url:'/users/logout',
            method:'POST'
        }).success(function(user){
            $rootScope.me = null;
            $location.path('/login');
        }).error(function(){
            $location.path('/login');
        });
    }

    $scope.isActive = function(path){
        return path == $location.path();
    }

});

angular.module('shopApp').controller('HomeCtrl',function(){

});

angular.module('shopApp').controller('RegCtrl',function($scope,$http,$location){
    $scope.user = {};

    $scope.save = function(){
        //console.log('1111111111111111')
        //console.log($scope.user); //前台输出都是在浏览器控制台显示的
        $http({
            url:'/users/reg',
            method:'POST',
            data:$scope.user
        }).success(function(user){
            $location.path('/users/login');
        }).error(function(err){
            if(err){
                console.log(err)
            }
            $location.path('/users/reg');
        });
    }
});

angular.module('shopApp').controller('LoginCtrl',function($rootScope,$scope,$http,$location){
    $scope.user={};

    $scope.login=function(){
        $http({
            url:'/users/login',
            method:'POST',
            data:$scope.user
        }).success(function(user){
            $rootScope.me=user;
            $location.path('/')
        }).error(function(err){
            $location.path('/users/login');
        })
    }
});

//只要进入商品后台管理页面 就进入这个控制器内部了
angular.module("shopApp").controller('GoodsCtrl',function($rootScope,$scope,$location,$http){

    $scope.goods=[];
    //后台商品显示到页面上
    $http({
        url:'/goods/list',
        method:'GET' //有缓存
    }).success(function(goods){
        $scope.goods=goods;
    }).error(function(err){

    })

    //点击确定保存输入的商品信息
    $scope.save=function(){
        $http({
            url:'/goods/add',
            method:'POST',
            data:$scope.good
        }).success(function(good){
            //保存之后立即显示新加的商品
            if (!$scope.good._id)
                $scope.goods.push(good);
            else {
                $scope.goods.forEach(function (good) {
                    if (good._id = $scope.good._id) {
                        good = $scope.good;
                    }
                });
            }
        }).error(function(err){

        })
    }

    //删除商品
    $scope.delete = function () {
        $http({
            url: '/goods/delete',
            method: 'POST',
            data: $scope.good
        }).success(function (good) {
            $scope.goods = $scope.goods.filter(function (good) {
                return good._id != $scope.good._id;
            });


            $("#pox").hide(); //可以再控制器中操作dom


        }).error(function () {

        });
    }
})

//后台商品管理指令--------添加商品指令
angular.module("shopApp").directive('addGoods',function(){
    return {
        link:function(scope,element,attrs){
            element.bind('click',function(){
                //每次添加商品前都先清空输入框中的内容 凡是dom操作等行为都会切断双向数据绑定的问题
                //$apply强制刷新视图
                scope.$apply(function(){
                    scope.good={};
                })
                $("#box").show();//$是jquery的方法引入jq库
            })

            $("#add").bind('click',function(){
                $("#box").hide();
            })

            $("#cha").bind('click',function(){
                $("#box").hide();
            })
        }
    }
})

//修改商品指令
angular.module("shopApp").directive('editGoods',function(){
    return {
        link:function(scope,element,attrs){
            element.bind('click',function(){
                scope.$apply(function(){
                    scope.$parent.good=scope.goods[attrs.index];
                })
                $("#box").show();//$是jquery的方法引入jq库
            })

            $("#add").bind('click',function(){
                $("#box").hide();
            })

            $("#cha").bind('click',function(){
                $("#box").hide();
            })
        }
    }
})

//查看商品指令
angular.module("shopApp").directive('viewGoods',function(){
    return {
        link:function(scope,element,attrs){
            element.bind('click',function(){
                scope.$apply(function(){
                    scope.$parent.good=scope.goods[attrs.index];
                })
                $("#sox").show();//$是jquery的方法引入jq库
            })

            $("#view").bind('click',function(){
                $("#sox").hide();
            })
        }
    }
})

//删除商品指令
angular.module("shopApp").directive('deleteGoods',function(){
    return {
        link:function(scope,element,attrs){
            element.bind('click',function(){
                scope.$apply(function(){
                    scope.$parent.good=scope.goods[attrs.index];
                })
                $("#pox").show();//$是jquery的方法引入jq库
            })
            $("#view").bind('click',function(){
                $("pox").hide();
            })
        }
    }
})

//全选
angular.module('shopApp').directive('selectAllGoods', function () {
    return {
        link: function (scope, element, attrs) {
            element.on('click',function () {
                var self = $(this);
                $("input[type='checkbox']").each(function () {
                    $(this).prop('checked', self.prop('checked')); //把当前按钮的状态赋值给所有复选框的按钮
                    //prop是固有属性的取值 赋值 attr是自定义属性的取值赋值
                });
            });
        }
    }
})

angular.module('shopApp').directive('selectGoodItem', function () {
    return {
        link: function (scope, element, attrs) {
            element.on('click',function () {
                var isChecked = $("input[type='checkbox']:not(:checked)").length ? false : true;
                $('#selectAllGoods').prop('checked', isChecked);
            });
        }
    }
})

angular.module('shopApp').directive('batchDeleteGoods', function (dataService) {
    return {
        link: function (scope, element, attrs) {
            element.on('click',function () {
                var goods = $("input[type='checkbox']:checked");
                var _ids = [];
                goods.each(function (index, good) {
                    _ids.push($(good).attr('data-id'));
                });
                dataService.post('/goods/batchDelete', {_ids: _ids}, function (data) {
                    scope.goods = scope.goods.filter(function (good) {
                        return _ids.indexOf(good._id) == -1;
                    });
                });
            });
        }
    }
})



