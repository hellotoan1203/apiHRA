var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var verify = require('./middleware/verify');
var userServices = require('./services/userService');
var config = require('./config')

var bodyParserUrlEncoded = bodyParser.urlencoded({ 
    extended: true
});


router.post('/login', bodyParserUrlEncoded, function(req, res){
    let user = req.body.username;
    let password = req.body.password;
    if(user&&password){
        userServices.read(user, (data)=>{
            console.log(data);
            if(data.userData.username == user && data.userData.password == password){
                console.log(user)
                console.log(password);
                let token = jwt.sign({username: user},config.secret);
                console.lg
                res.json([{
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                }])
            }
            else {
                res.json([{
                    success: false,
                    message: 'Incorrect username or password'
                  }]);
            }
        })     
    }else{
        res.json([{
            success: false,
            message: 'Invalid request'
          }]);
    }
})

router.get('/user', verify.checkToken, (req,res)=>{
    let user = req.decode.username; 
    userServices.read(user,(data)=>{
        res.json([data]);
    })
})
router.post('/register',bodyParserUrlEncoded, function(req,res){
    let user = req.body.username;
    let password = req.body.password;
    userServices.add({username: user, password: password}, (status)=>{
        if(status == 'success'){
            let token = jwt.sign({username: user},config.secret);
            res.json([{
                success: true,
                message: 'Authentication successful!',
                token: token
            }])
        }else{
            res.json([{
                success: false,
                message: 'User has been signed up'
            }])
        }
    })
})
router.patch('/user',bodyParserUrlEncoded,verify.checkToken, function(req, res){
    let user = req.decode.username;
    let bloodgroup = req.body.bloodgroup;
    let height = req.body.height;
    let address = req.body.address;
    let bloodpressure = req.body.bloodpressure;
    let weight = req.body.weight;
    let birthday = req.body.birthday;

    userServices.update(user,{
        bloodgroup: bloodgroup,
        height: height,
        address: address,
        bloodpressure: bloodpressure,
        weight: weight,
        birthday: birthday
    });
    res.json([{
        message: 'Update successfully'
    }])
})
router.patch('/usermedical',bodyParserUrlEncoded,verify.checkToken,function(req,res){
    //some thing just like this
    let user = req.decode.username;
    let diseaseName = req.body.diseasename;
    let time = new Date().getTime() / 1000;
    let drug = req.body.drug.split('-');
    let reexamination = req.body.reexamination;
    let treatment = req.body.treatment;
    let medicaltest = req.body.medicaltest;

    let object ={
        name: diseaseName,
        time: time,
        drug: drug,
        reexamination: reexamination,
        treatment: treatment,
        medicaltest: medicaltest
    }

    userServices.updatehistory(user,object);
    res.json([{
        message: 'Update sucessfully'
    }])
})

module.exports.router = router;