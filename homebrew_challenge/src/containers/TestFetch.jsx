import React, { useState, useEffect, useRef } from "react";
import { getRequest } from '../helpers/requests';
import PercentTestsChart from '../components/PercentTestsChart/PercentTestsChart';

const TestFetch = () => {
  const [results, setResults] = useState([]);
  const componentIsMounted = useRef(true);

  useEffect(() => {
    getRequest()
      .then(response => {
        if (componentIsMounted.current) {
          setResults(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);
  return (
    <>
      <PercentTestsChart/>
    </>
  );
};

export default TestFetch;
