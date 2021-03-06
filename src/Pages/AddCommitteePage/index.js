import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Loading, LayoutManageEvent, AddCommittee } from "../../Containers";
import axios from "axios";
import useUserData from "../../Hooks/useUserData";

const AddCommitteePage = (props) => {
  const { REACT_APP_REQUEST_URL } = process.env;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(window.outerWidth <= 600 ? false : true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { userData, setUserData, removeUserData } = useUserData();

  const addCommittee = async (committee) => {
    setError(false);
    setAlert(false);
    setMessage("");
    setLoading(true);
    await axios
      .post(`${REACT_APP_REQUEST_URL}/committee/create`, committee, {
        headers: { authorization: `Bearer ${userData.accessToken}` },
      })
      .then((res) => {
        setAlert(true);
        setMessage(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data.error &&
          err.response.data.error === "jwt expired"
        ) {
          axios
            .post(`${REACT_APP_REQUEST_URL}/token`, {
              userEmail: userData.email,
              refreshToken: userData.refreshToken,
            })
            .then((res) => {
              let tmp = userData;
              tmp.accessToken = res.data.accessToken;
              setUserData(tmp);
              addCommittee(committee);
            })
            .catch((err) => {
              removeUserData();
              history.push("/");
            });
        } else {
          setAlert(true);
          setError(true);
          let errorMessage = "Error";
          if (err.response && err.response.data.error) {
            errorMessage = err.response.data.error;
          }
          setMessage(errorMessage);
          setLoading(false);
        }
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <LayoutManageEvent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      page={"committee"}
      breadcrumb={"Committee / Add Committee"}
      title={"Add Committee"}
    >
      <AddCommittee
        alert={alert}
        error={error}
        message={message}
        addCommittee={addCommittee}
      />
    </LayoutManageEvent>
  );
};

export default AddCommitteePage;
