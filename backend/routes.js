const express = require("express");
const excelModel = require("./models");
const app = express();
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;

const corsOptions = { 
  origin:'http://localhost:3000',
  AccessControlAllowOrigin: '*',  
  // origin: '*',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}

async function addExcelSheet(data) {
  const excel = new excelModel(data);
  try {
    await excel.save({ validateBeforeSave: false });
    return excel;
  } catch (error) {
    throw error;
  }
}


app.post("/add_excel", cors(corsOptions), async (request, response) => {

  request.header("Access-Control-Allow-Origin", "*");
  try {
    const excel = await addExcelSheet(request.body);
    response.send(excel);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.put("/update_excel", cors(corsOptions), async (request, response) => {
  const queryCondition = { name: request.query.name };
  const updatedData = request.body;

  try {
    let updatedSheet = await excelModel.findOne(queryCondition);

    if (!updatedSheet) {
      // If the document is not found, create a new one
      updatedSheet = await addExcelSheet(updatedData);
      response.status(201).send(updatedSheet); // Return a 201 Created status code
    } else {
      // Update the existing document
      updatedSheet.set(updatedData);
      await updatedSheet.save();
      response.send(updatedSheet);
    }
  } catch (error) {
    response.status(500).send(error);
  }

});


app.get("/get_excel", cors(corsOptions), async (request, response) => {
  //console.log(request.query.name)
  const users = await excelModel.find({name: request.query.name});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});


app.get("/get_excels", cors(corsOptions), async (request, response) => {
    const excels = await excelModel.find({});
  
    try {
      response.send(excels);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

  module.exports = app;