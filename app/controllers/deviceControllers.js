const deviceQuery = require("../services/queries/deviceQuery");
const httpContext = require("express-http-context");
const moment = require("moment");
const path = require("path");

const deviceController = {};

deviceController.delete_device = async (req, res) =>{
    const {id} = req.body;
    try{
        const consumDelete = await deviceQuery.consumptionDelete(id);
        if(consumDelete){
            const device = await deviceQuery.deleteFisico(id);
            if(device){
                return res.sendStatus(200);
            } else{
                return res.sendStatus(400);
            }
        } else{
            return res.sendStatus(400)
        }
    }catch(err){
        throw new Error(err);
    }
};

deviceController.add_device = async (req, res) =>{
    let user = httpContext.get("user");
    const {name, tag,idDevModel} = req.body;

    if(!name || !tag || !idDevModel) return res.sendStatus(409);
    try{
        const add = await deviceQuery.add_device(req.body, user);
        if(!add) return res.sendStatus(400);
        const device = await deviceQuery.getDevTag(tag);
        if(!device) res.sendStatus(404);
        const jsonDiv = await deviceQuery.findDivByIduser(user);
        return (jsonDiv) ? res.json(jsonDiv) : res.sendStatus(404);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.addImage = async(req, res) =>{
    const {variable} = req.body;
    if(!variable) return res.sendStatus(409);
    try{
        if(!req.files || Object.keys(req.files).length === 0){
            return res.sendStatus(400);
        }
        const images = !req.files.imagen.length ? [req.files.imagen] : req.files.imagen;
        for(const item of images){
            let uploadPath= path.join(__dirname,"../resources/images/" + item.name);
            console.log(uploadPath);
            item.mv(uploadPath, (err) =>{
                if(err) return res.sendStatus(500);
            })
            await deviceQuery.add_image(variable, uploadPath);
        }
        return res.sendStatus(200);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.totalmodels = async(req, res) =>{
    const {variable} = req.body;
    if(!variable) return res.sendStatus(409);
    try{
        const result = await deviceQuery.getModels(variable);
        return (!result) ? res.sendStatus(500) : res.json(result);
    }catch(err){
        throw new Error(err);
    }
};


deviceController.findAllDevices = async(req, res) =>{
    let user = httpContext.get("user");
    try{
        const allDevices = await deviceQuery.findDivByIduser(user);
        return (allDevices) ? res.json(allDevices) : res.sendStatus(404);
    }catch(err){
        throw new Error(err);
    }
};

const deviceOn = async(idDevModel, idDevice) =>{
    try{
        const deviceState = await deviceQuery.getDevice(idDevice);
        if(deviceState.state === process.env.ON) return false;
            let lastOn = new Date();
            const addActivity = await deviceQuery.On(idDevice, lastOn, idDevModel);
            if(!addActivity) return false;
            await deviceQuery.changeActivity(idDevice, process.env.ON);
            const resultConsumptionOn = await deviceQuery.activityNow(idDevice);
            return resultConsumptionOn;
    }catch(err){
        throw new Error(err);
    }
};

            function diff_hour(dt2, dt1){
                let diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60);
                return diff;
            };

            function EachHour(hourOn,hourOff){
                let startHour= parseInt(hourOn);
                let endHour= parseInt(hourOff);
                let allHour= [];
                if(startHour <= endHour){
                    for(let i = startHour; i <= endHour; i++){
                    allHour.push(`${i}-${i+1}`)
                    }
                } else{
                    for(let i = startHour; i < 24; i++){
                        allHour.push(`${i}-${i+1}`);
                    }
                    for(let i= 0; i< endHour; i++){
                        allHour.push(`${i}-${i+1}`);
                    }
                }
                return allHour;
            };

            function handleDateChange(on,off){
                const onMoment = moment(on, 'DD-MM-YYYY HH:mm:ss');
                const offMoment = moment(off, 'DD-MM-YYYY HH:mm:ss');

                if(onMoment.isSame(offMoment,'day')){
                    return{
                        dateOn: onMoment.format('DD-MM-YYYY'),
                        dateOff:offMoment.format('DD-MM-YYYY'),
                    };
                } else{
                    let dateOn = onMoment.format('DD-MM-YYYY');
                    let dateOff = onMoment.format('DD-MM-YYYY');
                    return{
                        dateOn: dateOn,
                        dateOff: dateOff,
                    };
                }
            };

            function consumptionHours(on,off){
                const dateHourOn = on
                    const dateHour1 = moment(dateHourOn, 'DD-MM-YYYY HH:mm:ss');
                    const hourOn = dateHour1.format('HH');
                const dateHourOff = off;
                    const dateHour2 = moment(dateHourOff, 'DD-MM-YYYY HH:mm:ss');
                    const hourOff = dateHour2.format('HH'); 
                        return {hourOn,hourOff};
            };

const deviceOff = async(id, idDevModel, idDevice) =>{
    try{
        const findDevice = await deviceQuery.activityNow(idDevice);
            if(findDevice.lastOff !== null) return false;
                    let lastOff = new Date();
                    const activityOff = await deviceQuery.Off(id, lastOff);
                if(!activityOff) return false;
            const changeDevActivity = await deviceQuery.changeActivity(idDevice, process.env.OFF);
                if(!changeDevActivity) return false;                
            const consumption = await deviceQuery.getIdDeviceConsumption(id);
                if(!consumption.lastOn && !consumption.lastOff) return false;
                    let dt2 = new Date(consumption.lastOn);
                    let dt1 = new Date(consumption.lastOff);
                    let totalTime = diff_hour(dt1,dt2);
            const hours = await deviceQuery.totalHours(id, totalTime);
                if(!hours) return false;
            const findModel = await deviceQuery.KwhPerHour(idDevModel);
                if(!findModel.consumo) return false;
            const totalKwh = (findModel.consumo * totalTime);
            const kwh = await deviceQuery.KwhTotal(id, totalKwh);
                if(!kwh) return false;
            const {dateOn, dateOff} = handleDateChange(consumption.lastOn,consumption.lastOff);
            const {hourOn,hourOff} = consumptionHours(consumption.lastOn,consumption.lastOff);
            const totalConsumptionHours = EachHour(hourOn,hourOff);
            const moneyActivity= await deviceQuery.totalMoney(dateOn, dateOff, totalConsumptionHours);
            if(!moneyActivity) return false;
            const convert = (moneyActivity/1000);
            const result = convert * findModel.consumo;
            const moneyInserted = await deviceQuery.insertMoneyConsumption(id, result);
            return (!moneyInserted) ? false : true;
    }catch(err){
    
        throw new Error(err);
    }
};

deviceController.switchDevice = async(req, res) =>{
    const {id, idDevModel, idDevice} = req.body;
    let user = httpContext.get("user");
    try{
        const deviceState = await deviceQuery.getDevice(idDevice);
        if(deviceState.state === process.env.OFF){
            const activityOn = await deviceOn(idDevModel, idDevice);
            if(activityOn){
                    const jsonActivity = await deviceQuery.findDivByIduser(user);
                if(jsonActivity){
                    res.json(jsonActivity);
                } else{
                    res.sendStatus(404);
                }
            }else{
                res.sendstatus(400);
            }
        } else{
            const activityOff = await deviceOff(id, idDevModel, idDevice);
            if(activityOff){
                const jsonActivity = await deviceQuery.findDivByIduser(user);
                if(jsonActivity){
                    res.json(jsonActivity);
                } else{
                    res.sendStatus(404);
                }
            }else{
                res.sendStatus(400);
            }
        }
    }catch(err){
        throw new Error(err);
    };
};




module.exports = {deviceController, deviceOn, deviceOff};