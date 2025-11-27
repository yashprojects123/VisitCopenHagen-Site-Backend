
let MenuModel = require("../model/Menu.model.js")

let createMenu = async(req,res) =>{
        let menuData = req.body;
        try{
                let newMenu = await new MenuModel({
                menuLabel: menuData.menuLabel,
                menuKey: menuData.menuKey
                })
                newMenu.save();
                res.status(201).json({
                received_data: menuData,
                status: 'Success',
                status_code: 201
                })
                console.log("New Menu created: "+menuData.menuLabel);
        }
        catch(error){
                res.send({
                message:  `Error: ${error.message}`,
                status: 'Error',
                status_code: 400
                })
        }
}

let updateMenu = async(req,res) =>{
        let menuData = req.body;
        console.log(req.body)
        const menuKey = menuData.menuKey;
        console.log("Menu update triggered");
        try{
                let menuExist = await MenuModel.findOne({menuKey: menuKey});
                if(menuExist){
                  await MenuModel.updateOne({menuKey: menuKey}, {$set: {
                    menuLabel: menuData.menuLabel, 
                    menuLinks: menuData.menuLinks
                  }});
                  res.status(200).json({
                updated_data: menuData,
                status: 'Success',
                status_code: 200
                });
                console.log("Menu Updated: "+menuData.menuLabel);
                }
                else{
                  res.send({
                message:  `Error: Menu doesn't exist`,
                status: 'Error',
                status_code: 404
                })
                }
        }
        catch(error){
                res.send({
                message:  `Error: ${error.message}`,
                status: 'Error',
                status_code: 400
                })
        }
}


const getMenuByName = async (req, res) => {
  try {
    const menuToSearch = req.query.menuKey;
    console.log("User searched menu: " + menuToSearch);

    const menu = await MenuModel.findOne({ menuKey: menuToSearch }).lean(); 

    if (menu) {
      res.status(200).json({
        data: menu,
        status: "Success"
      });
      // console.log(menu)
    } else {
      res.status(200).json({
        data: [],
        status: "Success"
      });
    }
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
};


module.exports={
      createMenu,
      getMenuByName,
      updateMenu  
}