import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Loading,
  LayoutManageEvent,
  Error,
  NotFound,
  Attendance,
} from "../../Containers";
import axios from "axios";
import useUserData from "../../Hooks/useUserData";

const AttendancePage = (props) => {
  const { REACT_APP_REQUEST_URL } = process.env;
  const history = useHistory();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(window.outerWidth <= 600 ? false : true);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { userData, setUserData, removeUserData } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      axios
        .get(`${REACT_APP_REQUEST_URL}/guest/attendance/${id}`, {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        })
        .then((res) => {
          setData(res.data.result);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response && err.response.data.error) {
            if (err.response.data.error === "jwt expired") {
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
            } else if (err.response.data.error === "No event found") {
              setNotFound(true);
              setLoading(false);
            }
          } else {
            setErrorRequest(true);
            setLoading(false);
          }
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guestAttend = async (guest) => {
    setError(false);
    setAlert(false);
    setMessage("");
    setLoading(true);
    await axios
      .put(`${REACT_APP_REQUEST_URL}/guest/attend`, guest, {
        headers: { authorization: `Bearer ${userData.accessToken}` },
      })
      .then((res) => {
        setAlert(true);
        setMessage(res.data.message);
        setData(res.data.result);
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
              guestAttend(guest);
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

  if (notFound) {
    return <NotFound />;
  }

  if (errorRequest) {
    return <Error />;
  }

  return (
    <LayoutManageEvent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      page={"attendance"}
      breadcrumb={"Attendance / Guest Attendance"}
      title={"Guest Attendance"}
    >
      <Attendance
        id={id}
        data={data}
        alert={alert}
        error={error}
        message={message}
        guestAttend={guestAttend}
      />
    </LayoutManageEvent>
  );
};

export default AttendancePage;
