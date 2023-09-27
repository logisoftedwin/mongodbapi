const mongoose = require("mongoose");

const ExcelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

},
{strict: false }
);

const Excel = mongoose.model("Excel", ExcelSchema);

module.exports = Excel;