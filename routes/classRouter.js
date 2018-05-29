var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
/**
 * 处理课程学习
 * 
*/
/* getAllClassList. 获得所有的课程列表 */
/**
 * request: none
 * respones:
{
    "result": true,
    "list": [
        {
            "chapters": [
                "5b09678e840a0f3ac4a18cb1"
            ],
            "_id": "5b0966f2840a0f3ac4a18cb0",
            "name": "c language",
            "des": "best programming language!",
            "videos": 3,
            "stars": 24
             imgUrl:"/static/imgs/card-saopaolo.png"
        }
    ],
    "des": "success"
}
 * 
 */
router.post('/getAllClassList', function (req, res, next) {
    let params = req.body;
    schemas.classModel.findAllClass(function (error, results) {
        if (error) {
            res.json({
                result: false,
                list: [],
                des: error
            })

        } else {
            console.log("getAll")
            res.json({
                result: true,
                list: results,
                des: "success"
            })

        }
    });

});

/* getClassStruct. 获得一个课程的结构，从视频列表的右上角进入*/

/**
 * request: {classId:}  课程的Id
 * respones:
{
    "result": true,
    "classStruct": {
        "chapters": [
            {
                "subChapters": [
                    {
                        "_id": "5b096926840a0f3ac4a18cb2",
                        "name": "first subChapter",
                        "des": "how to use ide",
                        "chapterId": "5b09678e840a0f3ac4a18cb1"
                    }
                ],
                "_id": "5b09678e840a0f3ac4a18cb1",
                "index": 1,
                "classId": "5b0966f2840a0f3ac4a18cb0",
                "des": "how to write hello world programm",
                "name": "first chapter"
            }
        ],
        "_id": "5b0966f2840a0f3ac4a18cb0",
        "name": "c language",
        "des": "best programming language!",
        "videos": 3,
        "stars": 24,
        "imgUrl": "/static/imgs/card-saopaolo.png"
    }
}
 * 
*/
router.post('/getClassStruct', function (req, res, next) {
    let params = req.body;
    if (params == null || params.classId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no class Id"
        })
    } else {
        schemas.classModel.findOne({ _id: params.classId }).populate({
            path: "chapters",
            model: 'chapterTable',
            populate: {
                path: 'subChapters',
                model: 'subChapterTable',

            }
        }).exec(function (error, results) {
            res.json({
                result: true,
                classStruct: results
            })

        })





    }



});

/**
 * getVideoDetails:获取一个视频播放页面的详情,从视频列表进入
 * 
 * request:{
 *     videoId:
 *    
 * }
 * respones:
 {
    "result": true,
    "videoDetail": {
        "videoCommentsId": [
            {
                "_id": "5b096aa5840a0f3ac4a18cb7",
                "userId": {
                    "_id": "5b096a4f840a0f3ac4a18cb6",
                    "userName": "jack",
                    "imgUrl": "./assets/imgs/user2.png"
                },
                "videoId": "5b096955840a0f3ac4a18cb3",
                "des": "Woooooooo,amazing!",
                "stars": 14
            }
        ],
        "_id": "5b096955840a0f3ac4a18cb3",
        "name": "write program",
        "url": "static/videos/video_1.mp4",
        "views": 16,
        "stars": 33,
        "classId": "5b0966f2840a0f3ac4a18cb0"
    }
}
 * 
*/
router.post('/getVideoDetails', function (req, res, next) {
    let params = req.body;
    if (params == null || params.videoId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no video Id"
        })
    } else {
        schemas.videoModel.findOne({ _id: params.videoId }).populate({
            path: "videoCommentsId",
            model: 'videoCommentTable',
            populate: {
                path: 'userId',
                model: 'userTable',
                select: "userName imgUrl"

            }
        }).exec(function (error, results) {
            res.json({
                result: true,
                videoDetail: results
            })
        })
    }

});
/**
 * 搜索获取获取videoList,点击进入课程列表的时候
 * request:{
 *  videoName:"",
 *  classId:""
 *  
 * }
 * response:{
    "result": true,
    "videoList": [
        {
            "videoCommentsId": [
                {
                    "_id": "5b096aa5840a0f3ac4a18cb7",
                    "userId": {
                        "_id": "5b096a4f840a0f3ac4a18cb6",
                        "userName": "jack",
                        "imgUrl": "./assets/imgs/user2.png"
                    },
                    "videoId": "5b096955840a0f3ac4a18cb3",
                    "des": "Woooooooo,amazing!",
                    "stars": 14
                }
            ],
            "_id": "5b096955840a0f3ac4a18cb3",
            "name": "write program",
            "url": "static/videos/video_1.mp4",
            "views": 16,
            "stars": 33,
            "classId": "5b0966f2840a0f3ac4a18cb0"
        }
    ]
}
 * 
*/
router.post('/searchVideos', function (req, res, next) {
    let params = req.body;
    if (params == null || params.videoName == undefined || params.classId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no viedoName  or classId"
        })
    } else {
        schemas.videoModel.find({ classId: params.classId, name: { $regex: params.videoName, $options: 'i' } }).populate({
            path: "videoCommentsId",
            model: 'videoCommentTable',
            populate: {
                path: 'userId',
                model: 'userTable',
                select: "userName imgUrl"

            }
        }).exec(function (error, results) {
            res.json({
                result: true,
                videoList: results
            })
        })
    }

});




/**
 * 
 * 发表评论
 * request:{
 *  userId:
 *  des:
 *  videoId:
 * 
 * }
 * 
 * 
*/
router.post('/commentToVideo', function (req, res, next) {
    let params = req.body;
    if (params == null || params.userId == undefined || params.des == undefined || params.videoId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no des  or userId no videoId"
        })
    } else {
        let thisComentModel = new schemas.videoCommentModel({ userId: params.userId, videoId: params.videoId, des: params.des, stars: 1 });
        thisComentModel.save(function (error) {
            if (error) {
                res.json({
                    result: false,
                    des: error.message,
                });
            } else {
                res.json({
                    result: true,
                    des: "comment successfully!",
                });
            }
        })
    }
});


/**/
module.exports = router;