import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const RoadMap = () => {

  return (

    <Carousel>
  <Carousel.Item>
  <img style={{'height':"600px"}}
      className="d-block w-100"  />
    <Carousel.Caption>
      <h3>Lockdown</h3>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <img style={{'height':"600px"}}
      className="d-block w-100"  />
    <Carousel.Caption>
      <h3>Phase 1</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <img style={{'height':"600px"}}
      className="d-block w-100"  />
    <Carousel.Caption>
      <h3>Phase 2</h3>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>

  );

};

export default RoadMap;
