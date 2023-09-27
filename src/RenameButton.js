import axios from "axios";

const RenameButton = async (sheetNames) => {

    //console.log(sheetNames);

  try {
    const dataToPost = {
        displayName:sheetNames
    };

    // Send a POST request to the server
    const response = await axios.put(
      "http://localhost:5000/update_excel?name=noOfSheet",
      dataToPost
    );

    // Handle the response from the server if needed
    console.log("Response from server:", response.data);
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export default RenameButton;
