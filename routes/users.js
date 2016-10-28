var express = require('express');
var router = express.Router();
var userModel=require('../module/user');
var crypto=require('crypto');

router.post('/reg',function(req,res){
    var user = req.body; //后台是通过req.body接受到ajax提交过来的数据
    //console.log('2222222222222')
    //console.log(user); //后台输出是在编辑器控制台输出的
    var username=user.username;
    var password=user.password;
    var email=user.email;

    password=crypto.createHash('md5').update(password).digest('hex');

    var usermodel=new userModel({
        username:username,
        password:password,
        email:email
    })

    usermodel.save(function(err,user){
        if(err){
            throw error
        }else{
            res.send(user);
        }
    })
});

router.post('/login',function(req,res){
    var user=req.body;
    var username=user.username;
    var password=user.password;
    password=crypto.createHash('md5').update(password).digest('hex');

    userModel.findOne({
        username:username,
        password:password
    },function(err,user){
        if(err){
            res.status(500).json({msg:err});
        }else{
            if(user){
                req.session.userId = user._id;//保持会话
                delete user['password'];
                res.json(user);
            }else{
                res.status(401).json({msg:'此用户不合法'});
            }
        }
    })
})


router.post('/validate',function(req,res){
    var userId = req.session.userId;
    if(userId){
        //刷新页面的时候如果session中有用户id 就根据id查找对应的用户信息 返给前台
        userModel.findOne({_id:userId},function(err,user){
            if(err){
                res.json(401,{msg:err});
            }else{
                res.json(user);
            }
        });
    }else{
        res.status(401).json({msg:'不存在'});
    }
});

router.post('/logout',function(req,res){
    req.session.userId = null;
    res.json({msg:'退出成功'});
});


module.exports = router;
