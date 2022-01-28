const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const editMainPageScheme = new Schema(
    {
        heading: { type: String },
        img_name: [{ type: Object }],
        about_us: { type: Boolean, required: true }
    },
    { versionKey: false }
);

module.exports = mongoose.model("editMainPage", editMainPageScheme);