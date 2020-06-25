import React from "react";
import Card from "react-bootstrap/Card";

function SingleValue({ id, title = "Missing title", value = "Missing value" }) {
  return (
    <Card>
      <Card.Body className="card-body border-0">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{value}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SingleValue;
