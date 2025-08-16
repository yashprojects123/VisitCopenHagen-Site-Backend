let { createMenu,updateMenu, getMenuByName } = require("../controller/MenuController.js");
let express = require("express")

let MenuApiRoutes = express.Router();


MenuApiRoutes.post('/admin/menu/add', createMenu);
MenuApiRoutes.put('/admin/menu/edit', updateMenu);
MenuApiRoutes.get('/admin/menu', getMenuByName);


module.exports = MenuApiRoutes;