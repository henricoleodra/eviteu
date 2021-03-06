import React from "react";
import { Link } from "react-router-dom";
import { NavbarBrand, Nav, NavItem, NavLink, Button } from "reactstrap";
import { Wrapper } from "./style";
import useUserData from "../../Hooks/useUserData";
import logo from "./../../Assets/Image/Profile/Logo.png";

const SideBar = (props) => {
  const { userData } = useUserData();

  return (
    <Wrapper>
      <div className={`left ${props.isOpen ? "active" : ""}`}>
        <Nav vertical id="sidebar" className="min-vh-100 shadow">
          <div className="content">
            <NavbarBrand className="my-5 d-flex flex-column align-items-center">
              <img src={logo} className="sidebar-brand" alt="Logo EViteU" />
            </NavbarBrand>
            <NavItem className={`mt-2 ${userData.role !== 1 ? "d-none" : ""}`}>
              <NavLink
                className={`text-white sidebar-menu p-3 ${
                  props.page === "event" ? "active" : ""
                }`}
                to="/manage-event/event-list"
                tag={Link}
              >
                Event
              </NavLink>
            </NavItem>
            <NavItem className={userData.role !== 1 ? "d-none" : ""}>
              <NavLink
                className={` sidebar-menu p-3 ${
                  props.page === "announcement" ? "active" : ""
                }`}
                to="/manage-event/announcement-list"
                tag={Link}
              >
                Announcement
              </NavLink>
            </NavItem>
            <NavItem className={userData.role !== 1 ? "d-none" : ""}>
              <NavLink
                className={` sidebar-menu p-3 ${
                  props.page === "guest" ? "active" : ""
                }`}
                to="/manage-event/guest-list"
                tag={Link}
              >
                Guest
              </NavLink>
            </NavItem>
            <NavItem className={userData.role !== 1 ? "d-none" : ""}>
              <NavLink
                className={` sidebar-menu p-3 ${
                  props.page === "committee" ? "active" : ""
                }`}
                to="/manage-event/committee-list"
                tag={Link}
              >
                Committee
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={` sidebar-menu p-3 ${
                  props.page === "doorprize" ? "active" : ""
                }`}
                to="/manage-event/doorprize-list"
                tag={Link}
              >
                Doorprize
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={` sidebar-menu p-3 ${
                  props.page === "attendance" ? "active" : ""
                }`}
                to="/manage-event/attendance-list"
                tag={Link}
              >
                Attendance
              </NavLink>
            </NavItem>
            <div className="wrapper-sidebar-logout mt-5">
              <Button
                className="btn-indigo sidebar-logout"
                onClick={() => {
                  props.handleLogOut();
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </Nav>
      </div>
    </Wrapper>
  );
};

export default SideBar;
