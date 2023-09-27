import React, { useEffect, useRef, useState } from "react";
import "handsontable/dist/handsontable.full.min.css";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import axios from "axios";
import "./App.css";
import loadingPic from "./loading.gif";
import PostDataToServer from "./PostDataToServer";
import RenameButton from "./RenameButton";

registerAllModules();

export default function Sheet({ sheetNo, sheetNames, setButtonNames, setButtonNamesMethod }) {
  const hotTableComponent = useRef(null);
  const [copiedData, setCopiedData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [boxText, setBoxTest] = useState("");

  //console.log(sheetNames)
  //console.log(sheetNo)

  useEffect(() => {
    const numRows = 400;
    const numCols = 26;
    const initialData = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => "")
    );
    setIsloading(true);
    axios
      .get("http://localhost:5000/get_excel?name=sheet" + sheetNo)
      .then((response) => {
        //console.log("Response from server:", response.data[0].data);

        if (response.data[0]?.data === undefined) {
          setTableData(initialData);
          setIsloading(false);
        } else {
          const newData = initialData.map((row, i) => {
            return row.map((cell, j) => {
              const cellKey = String.fromCharCode(65 + j) + (i + 1); // Convert to cell notation
              return response.data[0].data[cellKey] || ""; // Use the cell value from the server or an empty string
            });
          });

          Object.keys(response.data[0].data).forEach((cellKey) => {
            const [col, row] = cellKey.match(/([A-Z]+)(\d+)/).slice(1);
            newData[row - 1][col.charCodeAt(0) - 65] =
              response.data[0].data[cellKey];
          });

          setTableData(newData);
          setIsloading(false);
        }

        // setTableData(initialData);
        // setIsloading(false);
      });
  }, [sheetNo]);

  const copyToClipboard = (text) => {
    // Create a temporary input element to copy text to clipboard
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const pasteFromClipboard = () => {
    // Retrieve clipboard data and handle it
    navigator.clipboard.readText().then((text) => {
      // Do something with the pasted text (text variable contains the pasted data)
      // console.log("Pasted Data:", text);
    });
  };

  const handleSaveBtnClick = async () => {
    //console.log("save btn press");

    if (boxText.length === 0) {
      alert("sheet name cannot be empty");
    } else {
      try {
        setIsloading(true);
        await PostDataToServer(tableData, sheetNo);
        setIsloading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsloading(false);
      }

      try {
        sheetNames[sheetNo - 1] = boxText;
        //setButtonNames(sheetNames);
        setButtonNamesMethod(sheetNames);
        setIsloading(true);
        await RenameButton(sheetNames);
        setIsloading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsloading(false);
      }
    }
  };

  useEffect(() => {
    if (hotTableComponent.current) {
      const hot = hotTableComponent.current.hotInstance;
      hot.addHook("afterCopy", (data) => {
        // Store the copied data in state
        setCopiedData(data);
        // Copy the selected data to the clipboard
        copyToClipboard(data.map((row) => row.join("\t")).join("\n"));
      });
      hot.addHook("afterPaste", () => {
        // Paste data from the clipboard
        pasteFromClipboard();
      });
    }
  }, []);

  useEffect(() => {
    setBoxTest(sheetNames[sheetNo - 1]);
  }, [sheetNo, sheetNames]);

  return (
    <div>
      {isloading ? (
        <div className="center">
          <img
            src={loadingPic}
            alt="Loading"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              handleSaveBtnClick();
              //postDataToServer();
            }}
          >
            save
          </button>
          <input
            type="text"
            //initialData={sheetName}
            value={boxText}
            onChange={(e) => {
              setBoxTest(e.target.value);
              //console.log(e.target.value)
            }}
          />
          <HotTable
            ref={hotTableComponent}
            data={Object.values(tableData)} // Pass an array of arrays to HotTable
            rowHeaders={true}
            colHeaders={true}
            contextMenu={["copy", "cut", "paste"]}
            height="auto"
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
      )}
    </div>
  );
}
