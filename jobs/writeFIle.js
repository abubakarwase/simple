const User = require("../models/User");
const Referral = require("../models/Referral");
const Queue = require('bee-queue');
const redis = require('redis');
var fs = require('fs');
const { post } = require("../routes/user.routes");

const queue = new Queue('test', {
    prefix: 'bq',
    stallInterval: 5000,
    nearTermWindow: 1200000,
    delayedDebounce: 1000,
    redis: {
      host: '127.0.0.1',
      port: process.env.PORTREDIS || 6379,
      db: 0,
      options: {}
    },
    isWorker: true,
    getEvents: true,
    sendEvents: true,
    storeJobs: true,
    ensureScripts: true,
    activateDelayedJobs: false,
    removeOnSuccess: false,
    removeOnFailure: false,
    redisScanCount: 100
})


exports.writeFile = async (req)=>{
    const jobName = "Write File"
    const job = queue.createJob({jobName}).save()
    return job
}

queue.process(async (job) => {
    try {
        let path = "referrals.xls"
        if(fs.existsSync(path)) fs.unlinkSync(path)

        let start = new Date()
        let data = `Parent Details\t\t\tUser Details\t\t\t\nName\tGender\tCity\tName\tGender\tCity\n`;
        const posts = await Referral.aggregate([
            {
                $lookup: {
                    from: "users",
                    let : {user:"$user"},
                    pipeline:[
                        {
                            $match: {
                                $expr: { 
                                    $eq: [ "$_id" , "$$user"]
                                }
                            } 
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: {"profile" : 1, "city" : 1},
                        }
                    ],
                    as: "user"
                },
            },
            {
                $lookup: {
                    from: "users",
                    let : {parent:"$parent"},
                    pipeline:[
                        {
                            $match: {
                                $expr: { 
                                    $eq: [ "$_id" , "$$parent"]
                                }
                            } 
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: { "profile" : 1, "city" : 1 }
                        }
                    ],
                    as: "parent"
                },
            },
            // {
            //     $lookup: {

            //         from: 'users',
            //         let : {user:"$user", parent:"$parent"},
            //         pipeline:[
            //             {
            //             $facet: {
            //                 user: [
            //                 {
            //                     $match: {
            //                         $expr: { 
            //                             $eq: [ "$_id" , "$$user"]
            //                         },
            //                     },
            //                 },
            //                 ],
            //                 parent: [
            //                 {
            //                     $match: {
            //                         $expr: { 
            //                             $eq: [ "$_id" , "$$parent"]
            //                         }
            //                     },
            //                 }
            //                 ],
            //             },   
            //             },
            //         ],
            //         as: 'aggregated'
            //     },
            // }
        ]).cursor({ batchSize: 1 }).exec()

        posts.on('data', async (post)=>{
            console.log(post)
            data += `${post.aggregated[0].parent[0].profile.name.first} ${post.aggregated[0].parent[0].profile.name.last}\t${post.aggregated[0].parent[0].profile.gender}\t${post.aggregated[0].parent[0].city}\t${post.aggregated[0].user[0].profile.name.first} ${post.aggregated[0].user[0].profile.name.last}\t${post.aggregated[0].user[0].profile.gender}\t${post.aggregated[0].user[0].city}\n`
                    
            fs.appendFile(path, data, (err) => {
                if (err) throw err;
            });
            data=''
            console.log(new Date() - start)
        })
        console.log('Sheet updated')
    } catch (error) {
        console.log(error)
    }
})