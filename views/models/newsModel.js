const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NewsScheme = new Schema(
    {
        img: { type: String, required: true },
        heading: { type: String },
        date: { type: Date },
        text: { type: String },
        full_text: { type: String },
    },
    { versionKey: false }
);

module.exports = mongoose.model("news", NewsScheme);