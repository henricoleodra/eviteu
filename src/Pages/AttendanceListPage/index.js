import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  Loading,
  LayoutManageEvent,
  Error,
  AttendanceList,
} from "../../Containers";
import axios from "axios";
import useUserData from "../../Hooks/useUserData";

const AttendanceListPage = (props) => {
  const { REACT_APP_REQUEST_URL } = process.env;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(window.outerWidth <= 600 ? false : true);
  const [loading, setLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  const [data, setData] = useState([]);
  const { userData, setUserData, removeUserData } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = "lists";
      if (userData.role === 2) {
        url = "manage";
      }
      await axios
        .get(`${REACT_APP_REQUEST_URL}/event/${url}`, {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        })
        .then((res) => {
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
  }, []);

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
      page={"attendance"}
      breadcrumb={"Attendance"}
      title={"Attendance List"}
    >
      <AttendanceList data={data} />
    </LayoutManageEvent>
  );
};

export default AttendanceListPage;
