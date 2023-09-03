const {Prices_control} = require("../../context/context");

const dataQuery = {};

dataQuery.addPrices_control = async(dataPrice) => {
    let data;
    try{
        data = await Prices_control.build({
        date: dataPrice.date,
        hour: dataPrice.hour,
        price: dataPrice.price/1000
        });
        console.log(data);
        await data.save();
    }catch(err){
        throw new Error(err);
    }
};

module.exports= dataQuery;
