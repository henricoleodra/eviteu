import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Loading, LayoutManageEvent, Error, AddEvent } from "../../Containers";
import axios from "axios";
import useUserData from "../../Hooks/useUserData";

const AddEventPage = (props) => {
  const { REACT_APP_REQUEST_URL } = process.env;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(window.outerWidth <= 600 ? false : true);
  const [loading, setLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [type, setType] = useState([]);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { userData, setUserData, removeUserData } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios
        .get(`${REACT_APP_REQUEST_URL}/type/lists`, {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        })
        .then((res) => {
          setType(res.data.result);
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
                fetchData();
              })
              .catch((err) => {
                removeUserData();
                history.push("/");
              });
          } else {
            setErrorRequest(true);
            setLoading(false);
          }
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, userData]);

  const addEvent = async (data) => {
    setError(false);
    setAlert(false);
    setMessage("");
    setLoading(true);
    await axios
      .post(`${REACT_APP_REQUEST_URL}/event/create`, data, {
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
              addEvent(data);
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

  if (errorRequest) {
    return <Error />;
  }

  return (
    <LayoutManageEvent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      page={"event"}
      breadcrumb={"Event / Add Event"}
      title={"Add Event"}
    >
      <AddEvent
        type={type}
        alert={alert}
        error={error}
        message={message}
        addEvent={addEvent}
      />
    </LayoutManageEvent>
  );
};

export default AddEventPage;
