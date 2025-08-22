let { createMenu,updateMenu, getMenuByName } = require("../controller/MenuController.js");
let express = require("express")

let MenuApiRoutes = express.Router();

// Api for creating a menu
MenuApiRoutes.post('/admin/menu/add', createMenu);

// Api for editing/updating a menu
MenuApiRoutes.put('/admin/menu/edit', updateMenu);

//Api for access a menu by name
MenuApiRoutes.get('/admin/menu', getMenuByName);


module.exports = MenuApiRoutes;