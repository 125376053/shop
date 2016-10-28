
var mongoose=require('./index');

var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;

var goodSchema=new Schema({
    name:'String',
    price:'Number',
    img:'String'
},{collection:'good'})

var goodModel=mongoose.model('good',goodSchema);

module.exports=goodModel;