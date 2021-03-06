import React from "react";
import { Button, Row, Col, Label } from "reactstrap";
import { Wrapper } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronLeft,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./../../Assets/Image/Profile/Logo.png";

const Header = (props) => {
  return (
    <Wrapper>
      <Row className="wrapper-dashboard-header">
        <Col xs={6} className="wrapper-header-logo mt-1">
          <img src={logo} alt="Logo EViteU" />
        </Col>
        <Col xs={6} md={4} className="wrapper-header-button">
          <Button
            className="btn-indigo header-button"
            onClick={() => {
              props.setIsOpen(!props.isOpen);
            }}
          >
            <FontAwesomeIcon
              className="fa-lg"
              icon={props.isOpen ? faChevronLeft : faBars}
            />
          </Button>
        </Col>
        <Col md={8} className="wrapper-header-user ">
          <Row>
            <Col xs={5} className="align-self-center">
              <Label className="text-muted text-truncate mt-1 mb-0">
                <span className="font-weight-bold">Logged in as:</span>{" "}
                {props.userName}
              </Label>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                color="link"
                className="mr-2 text-decoration-none header-button-logout"
                onClick={() => {
                  props.handleLogOut();
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Header;
