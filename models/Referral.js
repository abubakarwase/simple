// const mongooseHidden = require('mongoose-hidden')();

const mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2');
// require('./Ride/Ride');s

const { Schema } = mongoose;

const ReferralSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  parentRole:{
    type: String,
    enum:['rider','driver'],
    default: 'rider',
  },
  level:{
    type: Number,
    default: 1,
    enum:[1,2,3,4,5]

  },

}, { timestamps: true });



ReferralSchema.statics.generateTree = async function (userId) {

    let user = await this.model('User').findById(userId,{referrer:1,referrerRole:1});
    let level = 1;
    while(level <= 5 &&  user.referrer){
      const r = await Referral.findOne({level,user: userId});
      if(!r){
        await this.create({
          level,user: userId, parent: user.referrer,parentRole: user.referrerRole
        });
      }
      user = await this.model('User').findById(  user.referrer,{referrer:1,referrerRole:1});
      level ++;

    }


};

async function addBonusToWallet(self,rideId,referral,isFistRide = false){

  //console.log(rideId,referral.level,referral.user,referral.parent,referral.parentRole);
  const account = await self.model('Account').getAccount(referral.parent,referral.parentRole);

          let amount = 1;
          if(isFistRide){
            if(level == 1){
              if(referral.parentRole == 'rider'){
                amount  = 120;
              }
              if(referral.parentRole == 'driver'){
                amount == 100;
              }
            }else
            if(level == 2 ){
              amount == 10;
            }else
            if(level >= 3 ){
              amount == 5;
            }
          }


          await account.createDepositForReferralBonus({
            userId: referral.parent,
            amount,
            rideId,
            referralId: referral.id
          });



}


ReferralSchema.statics.giveBonus = async function(rideId,role='rider'){
  const ride = await this.model('Ride').findById(rideId,{ rider:1 ,driver:1});
  console.log('giveBonus',ride);
  let count = 0;
  let user = null;
    if(role =='rider'){
      count =  await this.model('Ride').find({
        rider: ride.rider,
        driver: { $ne: null },
        'currentState.status':{$nin:['Timeout','CancelRider','CancelDriver']}
      },{ rider:1 });

       user  = await this.model('User').findById(ride.rider,{referrer:1,referrerRole:1});

    }else{
      count =   await this.model('Ride').find({
        driver: ride.driver,
        'currentState.status':{$nin:['Timeout','CancelRider','CancelDriver']}
      },{ rider:1 });

       user  = await this.model('User').findById(ride.driver,{referrer:1,referrerRole:1});
    }
      const referrals = await Referral.find({user:user.id})
      console.log(referrals);
    if(referrals.length>0){
      let i = 0;
      const promise = new Promise((resolve=>{
        var resolve2 = resolve;
        referrals.forEach(async referral=>{
          const par = await this.model('User').findById(referral.parent,{isBlock:1});
          if(par && !par.isBlock){
            await addBonusToWallet(this,rideId,referral,count == 1);
          }
          i++;
          if(i == referrals.length){
            resolve2(1);
          }
        })
      }));
      await promise;
    }





  }


// ReferralSchema.plugin(mongooseHidden, { hidden: { _id: false, storageDriver: true } });
// ReferralSchema.plugin(mongoosePaginate);

const Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;
