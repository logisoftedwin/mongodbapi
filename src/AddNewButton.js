import axios from "axios";

const AddNewSheet = async (sheetNo, buttonArray) => {

    //console.log("sheetNois:" + sheetNo);
    console.log(sheetNo)

    console.log(buttonArray)

  try {
    const dataToPost = {
      name: "noOfSheet",
      noOfSheet: sheetNo,
      displayName:buttonArray
    };

    //console.log(dataToPost)

    //Send a POST request to the server

    const response = await axios.put(
      "http://localhost:5000/update_excel?name=noOfSheet",
      dataToPost
    );

    //const response = "null"

    // Handle the response from the server if needed
    console.log("Response from server:", response.data);
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export default AddNewSheet;
