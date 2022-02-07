const mongoose = require("mongoose");
const { SchemaTypes } = mongoose;
const FeedSchema = new mongoose.Schema({
    createdAt:{
	type: Date,
	default: Date.now
    },
    title:{
       type: String,
       required: true
    },
    subject:{
	type: String
    },
    content:{
	type:String,
	required:true
    },
    docUrl:{
	type:String
    },
    comments:[
	{
	    comment: String,
	    docUrl: String,
            userId: {
		type:SchemaTypes.ObjectId,
		ref: "User"
	    }
	}
    ]
});

module.exports = mongoose.model("Feed", FeedSchema);
