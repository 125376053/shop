var express = require('express');
var router = express.Router();
var goodModel = require('../module/goods');
var async = require('async');

router.post('/add',function(req,res){

   var _id=req.body._id;
   if(_id){
      goodModel.update({
          _id:_id
      },req.body,function(err,good){
          if(err){
              res.status(500).json({msg:err})
          }else{
              console.log(good);
              res.send(good);
          }
      })
   }else{
       //±£´æ
       var goodmodel=new goodModel({
           name:req.body.name,
           price:req.body.price,
           img:req.body.img
       })
       goodmodel.save(function(err,good){
           if(err){
              res.status(500).json({msg:err})
           }else{
              console.log(good);
              res.send(good);
           }
       })
   }
})

router.get('/list',function(req,res){
    goodModel.find({},function(err,goods){
        if(err){
            res.status(500).json({msg:err})
        }else{
            console.log(goods);
            res.send(goods);
        }
    })
})

router.post('/delete',function(req,res){
    goodModel.remove({_id:req.body._id},function(err,result){
        if(err){
            res.json(500,{msg:err});
        }else{
            res.json(result);
        }
    });
});

module.exports = router;
