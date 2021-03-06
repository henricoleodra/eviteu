import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { LocationSearch } from "../../Components";
import { Wrapper } from "./style";

const EditEvent = (props) => {
  const tmpLatLng = props.data.coordinates
    ? props.data.coordinates.split("&")
    : "";
  const tmpDate = props.data.date ? props.data.date.substring(0, 10) : "";
  const [type, setType] = useState(props.data.idType);
  const [title, setTitle] = useState(props.data.eventTitle);
  const [subtitle, setSubtitle] = useState(props.data.eventSubTitle);
  const [description, setDescription] = useState(props.data.eventDescription);
  const [date, setDate] = useState(tmpDate);
  const [time, setTime] = useState(props.data.time);
  const [location, setLocation] = useState(props.data.location);
  const [latlng, setLatLng] = useState({
    lat: tmpLatLng[0],
    lng: tmpLatLng[1],
  });
  const [highlightImage, setHighlightImage] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(props.data.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(
    props.data.secondaryColor
  );
  const [accentColor, setAccentColor] = useState(props.data.accentColor);
  const [textColor, setTextColor] = useState(props.data.textColor);
  const [max, setMax] = useState(props.data.max);
  const [preview, setPreview] = useState(null);
  const [modal, setModal] = useState(false);
  const [invalidImage, setInvalidImage] = useState("");
  const [alert] = useState(props.alert);
  const [error] = useState(props.error);
  const [message] = useState(props.message);
  const [dif] = useState(Date.now());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("idEvent", props.data.idEvent);
    data.append("eventTitle", title);
    data.append("eventSubTitle", subtitle);
    data.append("eventDescription", description);
    data.append("eventHighlightName", props.data.eventHighlight);
    data.append("date", date);
    data.append("time", time);
    data.append("location", location);
    data.append("coordinates", latlng.lat + "&" + latlng.lng);
    data.append("primaryColor", primaryColor);
    data.append("secondaryColor", secondaryColor);
    data.append("accentColor", accentColor);
    data.append("textColor", textColor);
    data.append("max", max);
    data.append("idType", type);
    data.append("eventHighlight", highlightImage);
    await props.updateEvent(data);
  };

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleSubtitle = (event) => {
    setSubtitle(event.target.value);
  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleDate = (event) => {
    setDate(event.target.value);
  };

  const handleTime = (event) => {
    setTime(event.target.value);
  };

  const handleHighlightImage = (event) => {
    setInvalidImage("");
    const tmpImage = event.target.files[0];
    if (!tmpImage) {
      setInvalidImage("No image uploaded.");
      setPreview(null);
    } else if (tmpImage.type.match(/\.(jpg|jpeg|png)$/)) {
      setInvalidImage("Invalid image type.");
      setPreview(null);
    } else if (tmpImage.size > 5000000) {
      setInvalidImage("Image size exceeds allowed limit.");
      setPreview(null);
    } else {
      setHighlightImage(tmpImage);
      setPreview(URL.createObjectURL(tmpImage));
    }
  };

  const handlePrimaryColor = (event) => {
    setPrimaryColor(event.target.value);
  };

  const handleSecondaryColor = (event) => {
    setSecondaryColor(event.target.value);
  };

  const handleAccentColor = (event) => {
    setAccentColor(event.target.value);
  };

  const handleTextColor = (event) => {
    setTextColor(event.target.value);
  };

  const handleMax = (event) => {
    setMax(event.target.value);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <Wrapper>
      <div>
        <Alert isOpen={alert} color={error ? "danger" : "success"}>
          {message}
        </Alert>
      </div>
      <Row className="justify-content-center">
        <Col>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="eventType">Event Type</Label>
              <Input
                type="select"
                name="eventType"
                defaultValue={type}
                onChange={handleType}
                required
              >
                <option disabled>Select event type</option>
                {props.type.map((type) => (
                  <option
                    key={type.idType}
                    value={type.idType}
                    checked={type.idType === type}
                  >
                    {type.typeName}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="eventTitle">Title</Label>
              <Input
                type="text"
                name="eventTitle"
                value={title}
                onChange={handleTitle}
                placeholder="Enter event title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="eventSubTitle">Sub Title</Label>
              <Input
                type="text"
                name="eventSubTitle"
                value={subtitle}
                onChange={handleSubtitle}
                placeholder="Enter event sub title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="eventDescription">Description</Label>
              <Input
                type="textarea"
                name="eventDescription"
                value={description}
                onChange={handleDescription}
                placeholder="Enter event description"
                required
              />
            </FormGroup>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="eventDate">Date</Label>
                  <Input
                    type="date"
                    name="eventDate"
                    value={date}
                    onChange={handleDate}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="eventTime">Time</Label>
                  <Input
                    type="time"
                    name="eventTime"
                    value={time}
                    onChange={handleTime}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="eventLocation">Location</Label>
              <LocationSearch
                address={location}
                setAddress={setLocation}
                setLatLng={setLatLng}
              />
            </FormGroup>
            <FormGroup>
              <Label for="eventHighlightImage">Highlight Image</Label>
              <Input
                type="file"
                name="eventHighlightImage"
                onChange={handleHighlightImage}
                invalid={invalidImage !== ""}
              />
              <img
                src={
                  props.data.eventHighlight && preview === null
                    ? `http://localhost:8000/images/${props.data.eventHighlight}?${dif}`
                    : preview
                }
                className={`edit-event-preview-image mt-3 ${
                  invalidImage !== "" ? "d-none" : ""
                }`}
                alt="preview"
              />
              <FormFeedback>{invalidImage}</FormFeedback>
            </FormGroup>
            <Row className="justify-content-between" form>
              <Col md={3}>
                <FormGroup>
                  <Label for="eventPrimaryColor">Primary Color</Label>
                  <Input
                    type="color"
                    name="eventPrimaryColor"
                    value={primaryColor}
                    onChange={handlePrimaryColor}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="eventSecondaryColor">Secondary Color</Label>
                  <Input
                    type="color"
                    name="eventSecondaryColor"
                    value={secondaryColor}
                    onChange={handleSecondaryColor}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="eventAccentColor">Accent Color</Label>
                  <Input
                    type="color"
                    name="eventAccentColor"
                    value={accentColor}
                    onChange={handleAccentColor}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="eventTextColor">Text Color</Label>
                  <Input
                    type="color"
                    name="eventTextColor"
                    value={textColor}
                    onChange={handleTextColor}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-center">
              <Button className="btn-indigo" onClick={toggleModal}>
                Preview Color Scheme
              </Button>
            </div>
            <FormGroup>
              <Label for="eventMaxGuest">Max Number Each Guest can Bring</Label>
              <Input
                type="number"
                name="eventMaxGuest"
                value={max}
                onChange={handleMax}
                min="1"
                placeholder="Enter max number each geuest can bring"
                required
              />
            </FormGroup>
            <div className="d-flex my-3 justify-content-center">
              <Button className="btn-indigo" disabled={invalidImage !== ""}>
                Update
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Color Scheme Preview</ModalHeader>
        <ModalBody>
          <div style={{ backgroundColor: `${primaryColor}` }}>
            <p>Primary Color</p>
            <div style={{ backgroundColor: `${secondaryColor}` }}>
              <p>Secondary Color</p>
              <p style={{ color: `${textColor}` }}>Text Color</p>
              <Button
                style={{
                  color: `${textColor}`,
                  backgroundColor: `${accentColor}`,
                  borderColor: `${accentColor}`,
                }}
              >
                Button
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-indigo" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Wrapper>
  );
};

export default EditEvent;
