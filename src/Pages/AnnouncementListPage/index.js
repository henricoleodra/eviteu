import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Loading } from "../../Components";
import {
  LayoutManageEvent,
  WarningNoEvent,
  AnnouncementList,
} from "../../Containers";
import axios from "axios";
import useUserData from "../../LocalStorage/useUserData";

const AnnouncementListPage = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(window.outerWidth <= 600 ? false : true);
  const [loading, setLoading] = useState(false);
  const [noEvent, setNoEvent] = useState(false);
  const [event, setEvent] = useState([]);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { userData, setUserData, removeUserData } = useUserData();

  useEffect(() => {
    const errorHandling = async (error) => {
      if (error === "jwt expired") {
        axios
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
        removeUserData();
        history.push("/404");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await axios
        .get("http://localhost:8000/event/lists", {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        })
        .then((res) => {
          if (res.data.result.length === 0) {
            if (id) {
              history.push("/404");
            }
            setNoEvent(true);
            setLoading(false);
          } else {
            if (!id) {
              history.push(
                `/manage-event/announcement-list/${res.data.result[0].idEvent}`
              );
            } else {
              setEvent(res.data.result);
              axios
                .get(`http://localhost:8000/announcement/lists/${id}`, {
                  headers: {
                    authorization: `Bearer ${userData.accessToken}`,
                  },
                })
                .then((res) => {
                  setData(res.data.result);
                  setLoading(false);
                })
                .catch((err) => {
                  let error = "";
                  if (err.response.data.error) {
                    error = err.response.data.error;
                  }
                  errorHandling(error);
                });
            }
          }
        })
        .catch((err) => {
          let error = "";
          if (err.response.data.error) {
            error = err.response.data.error;
          }
          errorHandling(error);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const publishAnnouncement = async (announcement) => {
    setError(false);
    setAlert(false);
    setMessage("");
    setLoading(true);
    await axios
      .put("http://localhost:8000/announcement/publish", announcement, {
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
          err.response.data.error &&
          err.response.data.error === "jwt expired"
        ) {
          axios
            .post("http://localhost:8000/token", {
              userEmail: userData.email,
              refreshToken: userData.refreshToken,
            })
            .then((res) => {
              let tmp = userData;
              tmp.accessToken = res.data.accessToken;
              setUserData(tmp);
              publishAnnouncement();
            })
            .catch((err) => {
              removeUserData();
              history.push("/");
            });
        } else {
          setAlert(true);
          setError(true);
          let errorMessage = "Error";
          if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
          setMessage(errorMessage);
          setLoading(false);
        }
      });
  };

  const deleteAnnouncement = async (announcement) => {
    setError(false);
    setAlert(false);
    setMessage("");
    setLoading(true);
    await axios
      .delete("http://localhost:8000/announcement/delete", {
        headers: {
          authorization: `Bearer ${userData.accessToken}`,
        },
        data: announcement,
      })
      .then((res) => {
        setAlert(true);
        setMessage(res.data.message);
        setData(res.data.result);
        setLoading(false);
      })
      .catch((err) => {
        if (
          err.response.data.error &&
          err.response.data.error === "jwt expired"
        ) {
          axios
            .post("http://localhost:8000/token", {
              userEmail: userData.email,
              refreshToken: userData.refreshToken,
            })
            .then((res) => {
              let tmp = userData;
              tmp.accessToken = res.data.accessToken;
              setUserData(tmp);
              publishAnnouncement();
            })
            .catch((err) => {
              removeUserData();
              history.push("/");
            });
        } else {
          setAlert(true);
          setError(true);
          let errorMessage = "Error";
          if (err.response.data.error) {
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
      page={"announcement-list"}
      title={"Announcement"}
    >
      {noEvent ? (
        <WarningNoEvent />
      ) : (
        <AnnouncementList
          id={id}
          event={event}
          data={data}
          alert={alert}
          error={error}
          message={message}
          publishAnnouncement={publishAnnouncement}
          deleteAnnouncement={deleteAnnouncement}
        />
      )}
    </LayoutManageEvent>
  );
};

export default AnnouncementListPage;
