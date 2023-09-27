import axios from "axios";

const PostDataToServer = async (tableData, sheetNo) => {
  try {
    // Convert the table data to JSON format
    const jsonData = {};
    tableData.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellKey = String.fromCharCode(65 + j) + (i + 1); // Convert to cell notation
        const cellValue = cell || ""; // Use an empty string if the cell value is null
        if (cellValue.trim() !== "" && cellValue.trim() !== " ") {
          jsonData[cellKey] = cellValue;
        }
      });
    });

    const dataToPost = {
      name: "sheet" + sheetNo,
      data: jsonData,
    };

    // Send a POST request to the server
    const response = await axios.put("http://localhost:5000/update_excel?name=sheet" + sheetNo, dataToPost);
    
    // Handle the response from the server if needed
    console.log("Response from server:", response.data);
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }

  };

  export default PostDataToServer;