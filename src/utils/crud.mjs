//CRUD
//C
export const createOne = model => async (req,res)=>{
    //req.body is object so we construct the model from it 
    //user will be assigned to req with help of middleware
    console.log("gf")
    try{
        console.log(req.user._id)
        const newmodel = await model.create({...req.body,createdBy:req.user._id})
        res.status(201).json({data:newmodel})
    }catch(err){
        console.log(err.message)
        res.status(400).end()
    }
}

//R
export const getMany= model=> async(req,res)=>{
    //"/api/"
    const userID =req.user._id;
    try{
        const doc=await model.find({createdBy:userID})
        .lean()
        .exec()
        res.status(200).json({data:doc})
    }catch(err){
        console.log(err.message)
        res.status(400).end()
    }
}

export const getOne= model=> async(req,res)=>{
    //"api/:id"
    const id=req.params.id;
    const userID=req.user._id;
    try{
        const doc= await model.findOne(
            {createdBy:userID,
            _id:id})
            .lean()
            .exec()
        if(!doc)return res.status(404).end()
        res.status(200).json({data:doc})
    }catch(err){
        console.log(err.message);
        res.status(404).end()
    }
}

//U
export const updateOne=model=>async (req, res)=>{
    //"/api/:id"
    const id=req.params.id;
    const userID=req.user._id;
    try{
        const doc=await model.findOneAndUpdate(
            {createdBy:userID,
                _id:id},{...req.body},{new:true})
                .lean()
                .exec();
        if(!doc)return res.status(400).json({message:"no item"})
        res.status(200).json({data:doc})
    }catch(err){
        console.log(err.message);
        return res.status(400).end()
    }
}

//D
export const removeOne= model=> async(req,res)=>{
    //"api/:id"
    const id=req.params.id;
    const userID=req.user._id;
    try{
        const doc=await model.findOneAndRemove(
            {createdBy:userID,
                _id:id});
        if(!doc)return res.status(400).end()
        res.status(200).json({data:doc})
    }catch(err){
        console.log(err.message);
        return res.status(400).end()
    }
}

export const CRUDControllers = model =>({
    getMany:getMany(model),
    getOne:getOne(model),
    createOne:createOne(model),
    updateOne:updateOne(model),
    removeOne:removeOne(model),
})