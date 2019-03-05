const admin = require('firebase-admin');
var serviceAccount = require('../hradatabase-e6760-d2ccedfaaae6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

var addUser = (user, callback)=>{
    let userReft = db.collection('user').doc(user.username);
    userReft.get().then(data=>{
        if(data.exists){
            callback('error');
        }else{
            userReft.set(user).then(data=>{
                callback('success')
            });
        }
    })
    
}

var updateUser = (user, data)=>{
    let userReft = db.collection('user').doc(user);
    userReft.update(data)
}

var updateMedicalHistory = (user, data)=>{
    let userReft = db.collection('user').doc(user).collection('medicalhistory');
    userReft.add(data);
}

var getDataUser = (username, callback)=>{
    let userReft = db.collection('user').doc(username);
    let medicalHistory = db.collection('user').doc(username).collection('medicalhistory');
    userReft.get().then( doc =>{
        if(doc.exists){
            medicalHistory.get().then( qrs=>{
                let list = [];
                qrs.forEach(q=>{
                    list.push(q.data());
                })
                let object = {
                    userData: doc.data(),
                    medicalHistory: list
                }
                callback(object,null);
            })
            
        }
        else{
            let err = 'user does not exists';
            callback(null,err);
        }
    })
}

var deleteUser = (username)=>{
    let userReft = db.collection('user').doc(username);
    userReft.delete();
}

module.exports = {
    add: addUser,
    update: updateUser,
    delete: deleteUser,
    read: getDataUser,
    updatehistory: updateMedicalHistory
}


