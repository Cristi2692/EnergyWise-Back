const express = require("express");
const devControlControllers = require("../controllers/devControlControllers");

const devControlRoute = express.Router();

devControlRoute.get("/",devControlControllers.getInfoDevice);
devControlRoute.post("/programDev",devControlControllers.devProgramActivity);
devControlRoute.get("/deviceConfiguration",devControlControllers.getDeviceConfiguration);



module.exports = devControlRoute;