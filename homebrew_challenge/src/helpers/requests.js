const query = {
  
};

export const getRequest = async () => {
  try {
    const response = await fetch(`http://statistics.gov.scot/sparql.json?query=${query}`, {
      method: 'GET'
    });
    const results = await response.json();
    console.log(results);
    return results;
  }
  catch (err) {
    console.log(err);
  }
};
