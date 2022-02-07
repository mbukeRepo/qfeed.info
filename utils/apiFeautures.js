class APIFeautures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    sort(){
        if(this.queryStr.sort){
            // ascending order ?sort=price
            // descending order ?sort=-price
            // sort('price ratingsAverage')  
            // this first sort by price in case of same price then sort by ratingsAverage
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            // default sorting 
            // -createdAt newest created appear first
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v -comments');
        }

        return this;
    }
    paginate(){
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 5;
        const skip = (page -1 ) * limit;
        this.query = this.query.skip(skip).limit(limit);
        // if page makes us skip more resources than we have in the database
        // if(this.queryStr.page){
        //     const numOfTours = await Tour.countDocuments();
        //     if(numOfTours <= skip) throw new Error('this page is not found');
        // }
        return this;
    }
}

module.exports = APIFeautures;
