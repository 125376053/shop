
var mongoose=require('./index');

var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;

var userSchema=new Schema({
    username:'String',
    password:'String',
    email:'String'
},{collection:'user'})

var userModel=mongoose.model('user',userSchema);

module.exports=userModel;