import React, { useEffect, useState } from "react";
import Sheet from "./Sheet";
import axios from "axios";
import loadingPic from "./loading.gif";
import AddNewSheet from "./AddNewButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const [noOfSheet, setNoOfSheet] = useState(1);
  const [buttonNames, setButtonNames] = useState([]);
  const [currentSheetNo, setCurrentSheetNo] = useState(1);
  const [isloading, setIsloading] = useState(false);
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth0();

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_excel?name=noOfSheet")
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length !== 0) {
          setNoOfSheet(response.data[0].noOfSheet);
          //console.log(response.data[0].noOfSheet)
          setButtonNames(response.data[0].displayName);
        }
        //console.log(response.data[0].displayName);
      });
  }, []);

  useEffect(() => {
    console.log(buttonNames);
  }, [buttonNames]);

  const setButtonNamesMethod = (value) => {
    console.log(value);
    setButtonNames(value);
  };

  const addSheetButtons = async () => {
    setNoOfSheet(noOfSheet + 1);
    //console.log((noOfSheet))
    buttonNames.push("sheet" + (Number(noOfSheet) + 1));
    console.log(buttonNames);
    const newSheetNo = Number(noOfSheet) + 1;
    AddNewSheet(newSheetNo, buttonNames);
    //AddNewSheet({ newSheetNo , buttonNames});
  };

  const renderSheetButtons = () => {
    const buttons = [];
    for (let i = 1; i <= noOfSheet; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => {
            setCurrentSheetNo(i);
          }}
        >
          {buttonNames[i - 1]}
        </button>
      );
    }
    return buttons;
  };

  useEffect(() => {
    //console.log(isAuthenticated)
    // Redirect to login if the user is not authenticated
    if (!isAuthenticated && !isLoadingAuth) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoadingAuth, loginWithRedirect]);

  return (
    <div>
      {!isLoadingAuth ? (
        <>
          {!isAuthenticated ? (
            <div className="center">

              <div className="center">
                <img
                  src={loadingPic}
                  alt="Loading..."
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              {/* <button              
                className="btn btn-primary btn-block"
                onClick={() => loginWithRedirect()}
              >
                login
              </button> */}
</div>
          ) : (
            <div>
              <div>
                <div>
                  <button
                    onClick={() =>
                      logout({
                        returnTo: window.location.origin,
                      })
                    }
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => {
                      addSheetButtons();
                    }}
                  >
                    add new sheet
                  </button>
                  {renderSheetButtons()}
                </div>
                <Sheet
                  sheetNo={currentSheetNo}
                  sheetNames={buttonNames}
                  setButtonNames={setButtonNames}
                  setButtonNamesMethod={setButtonNamesMethod}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="center">
            <img
              src={loadingPic}
              alt="Loading..."
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
