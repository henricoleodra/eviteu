import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const AddAnnouncement = (props) => {
  const history = useHistory();
  const [id] = useState(props.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(0);
  const [alert, setAlert] = useState(props.alert);
  const [error] = useState(props.error);
  const [message] = useState(props.message);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      announcementTitle: title,
      announcementDescription: description,
      announcementStatus: status,
      idEvent: id,
    };
    props.addAnnouncement(data);
  };

  const handleSelect = (event) => {
    props.setAlert(false);
    setAlert(false);
    history.push(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleStatus = (event) => {
    if (event.target.checked) {
      setStatus(event.target.value);
    } else {
      setStatus(0);
    }
  };

  return (
    <div>
      <div>
        <Alert isOpen={alert} color={error ? "danger" : "success"}>
          {message}
        </Alert>
      </div>
      <Row className="justify-content-center">
        <Col>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type="select"
                name="event"
                defaultValue={id}
                onChange={handleSelect}
              >
                {props.event.map((event) => (
                  <option
                    key={event.idEvent}
                    value={event.idEvent}
                    checked={event.idEvent === id}
                  >
                    {event.eventTitle}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="announcementTitle">Announcement Title</Label>
              <Input
                type="text"
                name="announcementTitle"
                value={title}
                onChange={handleTitle}
                placeholder="Enter announcement title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="announcementDescription">
                Announcement Description
              </Label>
              <Input
                type="textarea"
                name="announcementDescription"
                value={description}
                onChange={handleDescription}
                placeholder="Enter announcement description"
                required
              />
            </FormGroup>
            <Label>Announcement Status</Label>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="announcementStatus"
                  checked={status}
                  onChange={handleStatus}
                  value={1}
                />{" "}
                Publish
              </Label>
            </FormGroup>
            <div className="d-flex my-3 justify-content-center">
              <Button className="btn-indigo">Create</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddAnnouncement;
