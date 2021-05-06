import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Loading } from "../../Components";
import { Error, Event } from "../../Containers";
import axios from "axios";
import useUserData from "../../LocalStorage/useUserData";

const EventPage = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [data, setData] = useState([]);
  const [announcement, setAnnouncement] = useState([]);
  const { userData, setUserData, removeUserData } = useUserData();

  useEffect(() => {
    const errorHandling = async (error) => {
      if (error === "jwt expired") {
        await axios
          .post("http://localhost:8000/token", {
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
    };

    const fetchData = async () => {
      setLoading(true);
      await axios
        .get("http://localhost:8000/event/information", {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        })
        .then((res) => {
          setData(res.data.result[0]);
          axios
            .get("http://localhost:8000/announcement/publishedLists", {
              headers: {
                authorization: `Bearer ${userData.accessToken}`,
              },
            })
            .then((res) => {
              setAnnouncement(res.data.result);
              setLoading(false);
            })
            .catch((err) => {
              let error = "";
              if (err.response && err.response.data.error) {
                error = err.response.data.error;
              }
              errorHandling(error);
            });
        })
        .catch((err) => {
          let error = "";
          if (err.response && err.response.data.error) {
            error = err.response.data.error;
          }
          errorHandling(error);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logOut = async () => {
    setLoading(true);
    await axios
      .delete("http://localhost:8000/logout", {
        data: {
          userEmail: userData.email,
          refreshToken: userData.refreshToken,
        },
      })
      .then((res) => {
        removeUserData();
        history.push("/");
      })
      .catch((err) => {
        history.push("/");
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (errorRequest) {
    return <Error />;
  }

  return (
    <React.Fragment>
      <Event data={data} announcement={announcement} logOut={logOut} />
    </React.Fragment>
  );
};

export default EventPage;
