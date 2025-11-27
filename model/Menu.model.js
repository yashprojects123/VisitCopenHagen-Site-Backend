let mongoose = require("mongoose");

let submenuLinkSchema = mongoose.Schema({
        title: {
                type: String,
                required: true
        },
        url: {
                type: String,
                required: true
        },
}
);

let menuLinkSchema = mongoose.Schema({
        title: {
                type: String,
                required: true
        },
        url: {
                type: String,
                required: true
        },
        subMenu: {
                type: [submenuLinkSchema], 
        },
})

let MenuSchema = mongoose.Schema({
        menuLabel: {
                type: String,
                default: "No-label"
        },
        menuKey: {
                type: String,
        },
        menuLinks: {
                type: [menuLinkSchema],
        },
})
let MenuModel = mongoose.model("SiteMenusData",MenuSchema);
module.exports = MenuModel;