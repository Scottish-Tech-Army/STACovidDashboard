import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "./LoadingComponent.css";

const LoadingComponent = () => {
  return (
    <>
      <div className="loading-component">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </>
  );
};

export default LoadingComponent;
