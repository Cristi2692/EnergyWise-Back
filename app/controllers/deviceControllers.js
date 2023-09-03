const deviceQuery = require("../services/queries/deviceQuery");

const deviceController = {};

deviceController.add_device = async (req, res) =>{
    const {id} = req.params;
    const {name, reference} = req.body;
    const {authorization} = req.headers;

    if(!name || !reference) return res.sendStatus(409);
    if(!authorization) return res.sendStatus(401);
    try{
        const exist_device = await deviceQuery.getDeviceReference(reference);
        if(exist_device) return res.sendStatus(409);
        await deviceQuery.add_device(req.body, id);
        const device = deviceQuery.getDeviceReference(reference);
        return (device) ? res.sendStatus(200) : res.sendStatus(404);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.delete_divice = async (req, res) =>{
    const {id} = req.params;
    const {authorization} = req.headers;
    if(!authorization) return res.sendStatus(401);
    try{
        const device = await deviceQuery.delete_device(id);
        return (!device) ? res.sendStatus(200) : res.sendStatus(500)
    }catch(err){
        throw new Error(err);
    }
}

deviceController.findAllDevices = async(req, res) =>{
    const {id} = req.params;
    const {authorization} = req.headers;
    if(!authorization) return res.sendStatus(401);
    try{
        const allDevices = await deviceQuery.findDivByIduser(id);
        return (allDevices) ? res.json(allDevices) : res.sendStatus(404);
    }catch(err){}
    throw new Error(err);
};



module.exports = deviceController;