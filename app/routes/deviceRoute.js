const express = require("express");
const deviceController = require("../controllers/deviceControllers");

const deviceRouter = express.Router();

deviceRouter.post("/:id",deviceController.add_device); // agregar dispositivo
deviceRouter.delete("/:id",deviceController.delete_divice); // eliminar dispositivo
deviceRouter.get("/:id",deviceController.findAllDevices); // encontar dispositivos con el mismo id_user
deviceRouter.get("/consumo/:id",deviceController.device_activity); // agregar consumo de dispositivo



module.exports= deviceRouter;