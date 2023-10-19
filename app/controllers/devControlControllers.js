const regressionjs = require("regression");
const devControlQuery = require("../services/queries/devControlQuery");
const cron = require("node-cron");
const moment = require("moment");
const { deviceOn, deviceOff } = require("./deviceControllers");
const deviceQuery = require("../services/queries/deviceQuery");

const devControlControllers = {};

const getData = async () => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const start = moment([year - 3, month])
      .startOf("month")
      .format("YYYY-MM-DD");
    const end = moment([year, month]).endOf("month").format("YYYY-MM-DD");
    console.log(start, end);
    const findDate = await devControlQuery.findLastDate(start, end);
    return findDate;
  } catch (err) {
    throw new Error(err);
  }
};

const futureData = async () => {
  try {
    let data = await getData();
    console.log(data);
    let totalData = [];
    for (let i = 0; i < data.length; i++) {
      totalData.push([parseInt(data[i].hora), data[i].precio]);
    }
    console.log(totalData);
    let result = regressionjs.linear(totalData);

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

devControlControllers.getInfoDevice = async (req, res) => {
  // esta no hace falta
  try {
    let future = await futureData();
    if (future) return res.json(future);
  } catch (err) {
    throw new Error(err);
  }
};

devControlControllers.getDeviceConfiguration = async (req, res) => {
  try {
   
    const data = await devControlQuery.findTask(req.query.deviceId);

    return (data) ? res.json(data) : res.sendStatus(404);

    
  } catch (err) {
    throw new Error(err);
  }
};

const cronControl = async () => {
  //parametros para poder activar y desactivar.

  let time = moment().format("YYYY-MM-DD HH:mm:ss");
  let time30 = moment().add(30, "minute").format("YYYY-MM-DD HH:mm:ss");
  try {
    const findTask = await devControlQuery.findActivity(time, time30);
    findTask.map(async (data) => {
      if (
        data.status === process.env.NOCOMPLETADO &&
        data.operationType === process.env.ON
      ) {
        // acá confirmo la existencia de la tarea del ON y si esta resuelta o no
        const onActivity = await deviceOn(data.idDevModel, data.idDevice);
        if (onActivity) {
          const updateTask = await devControlQuery.updateCompleteTask(
            data.id,
            process.env.COMPLETADO
          );
          if (updateTask) {
            return true;
          } else {
            return false;
          }
        }
      } else if (
        data.status == process.env.NOCOMPLETADO &&
        data.operationType === process.env.OFF
      ) {
        // acá confirmo la existencia de la tarea del OFF y si esta resuelta o no
        const findDevActivity = await deviceQuery.activityNow(data.idDevice);
        const offActivity = await deviceOff(
          findDevActivity.id,
          data.idDevModel,
          data.idDevice
        ); //aqui es el OFF
        if (offActivity) {
          const updateTask = await devControlQuery.updateCompleteTask(
            data.id,
            process.env.COMPLETADO
          );
          if (updateTask) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false; // si no encuentra tarea pues falso de toda la vida jajaja
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

devControlControllers.devProgramActivity = async (req, res) => {
  // se activa con boton programar.
  const activities = req.body; //agrupar el array que vendrá.
  if (!activities || activities.length === 0) return res.sendStatus(400); //solo compruebo 3 por que en principio no tengo el id hastq ue se encienda.
  try {
    const tasks = [];
    for (activity of activities) {
      const { idDevice, idDevModel, programTime, operationType } = activity;
      if (!idDevice || !idDevModel || !programTime || !operationType)
        return res.sendStatus(409);
      const addStartActivity = await devControlQuery.insertActivity(activity); //aca inserto cada tarea en una columna
      if (addStartActivity) {
        const taskInserted = await devControlQuery.findTask(idDevice);
        if (taskInserted) {
          tasks.push(taskInserted);
        } else {
         return res.sendStatus(500);
        }
      } else {
        return res.sendStatus(400);
      }
    }
    return res.json(tasks);
  } catch (err) {
    throw new Error(err);
  }
};

cron.schedule("*/2 * * * *", async () => {
  try {
    await cronControl();
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = devControlControllers;
