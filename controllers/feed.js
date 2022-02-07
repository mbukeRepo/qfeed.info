const catchAsync = require("../utils/catchAsync");
const Feed  = require("../models/feed.model");
const Api = require("../utils/apiFeautures");
const client = require("../services/cache")
exports.getAll = catchAsync(async (req, res, next) => {
    const feedQuery = new Api(Feed.find(), req.query).sort().limitFields().paginate();
    const feeds = await feedQuery.query;
    res.status(200).json({
        status:"success",
        resultLength: feeds.length,
        feeds
    })
});

exports.getSingle = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const feed = await Feed.findOne({_id: id})
		.populate({path: "comments", populate: {path:"userId"}})
		.cache({key: `One.${id}`});
	res.status(200).json({feed})
});

exports.search =  catchAsync(async (req, res, next) => {
	const searchString = req.params.search;
	const feeds = await Feed.find({$text: {$search: searchString}}).cache({key: "Many"});
	res.status(200).json({feeds})
});

exports.createFeed = catchAsync(async (req, res, next) => {
	const feed = await Feed.create(req.body);
        res.status(201).json({feed});
});

exports.comment = catchAsync(async (req, res, next) => {
    const feed =  await Feed.findOneAndUpdate({_id: req.params.id}, { 
        $push: { 
            comments:
            { userId: req.user._id, ...req.body} 
        } 
    })
    res.status(201).json({message:"comment created."});
    client.del(`One.${req.params.id}`)
});
