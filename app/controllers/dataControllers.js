const cron = require("node-cron");
const dataQuery = require("../services/queries/dataQuery");


const dataController= {};

const allprices = async() => {
    try{
        let data = await fetch("https://api.preciodelaluz.org/v1/prices/all?zone=PCB");
        let response = await data.json();
        const totalData = Object.values(response).map((element)=>{
            dataQuery.addPrices_control(element)
            return {
                date: element.date,
                hour: element.hour,
                price: element.price
            }
        });
        if(totalData.length === 0) return res.sendStatus(401);
        await dataQuery.addPrices_control(totalData);
    }catch(err){
        console.log(err.message);
        throw new Error
    }
};

dataController.allData = async(req, res) =>{
    try{
        let data = await fetch("https://api.preciodelaluz.org/v1/prices/all?zone=PCB");
        let response = await data.json();
        const totalData = Object.values(response).map((element)=>{
            dataQuery.addPrices_control(element)
            return {
                date: element.date,
                hour: element.hour,
                price: element.price/1000
            }
        });
        return (totalData.length === 0) ? res.sendStatus(500) : res.json(totalData);
    }catch(err){
        console.log(err.message);
        throw new Error
    };
};

dataController.electricPrice = async(req, res) =>{
    try{  
    const requests = [ 
    { url: 'https://api.preciodelaluz.org/v1/prices/min?zone=PCB' }, 
    { url: 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB' },
    { url:'https://api.preciodelaluz.org/v1/prices/max?zone=PCB'}
]
const responses = await Promise.all(requests.map((request) => fetch(request.url)));
    const data = await Promise.all(responses.map( async(res) =>{
        const jsonData = await res.json();
        return{
            date: jsonData.date,
            hour: jsonData.hour,
            price: jsonData.price/1000,
        }
    }))
    return (data.length === 0) ? res.sendStatus(500) : res.json(data);
        }catch(err){
            throw new Error(err);
    }
};

cron.schedule('0 0 * * *', () => {
    allprices();
});

module.exports = dataController;