const axios = require('axios');
const express = require('express')


// register
const registerCompany = async () => {
  const endpoint = 'http://20.244.56.144/test/register';


  const data = {
    companyName: 'Sastra University',
    ownerName:"Tejeswar reddy",
    rollNo: '125003366',
    ownerEmail: 'tejeswar.chinthala@gmail.com',
    accessCode: 'LGcHvG',
  };

  try {
    const response = await axios.post(endpoint, data);
    console.log('Company registered successfully:', response.data);
  } catch (error) {
    console.error('Error registering company:', error.response ? error.response.data : error.message);
  }
};

const authourazitionToken = async() =>{
    const endpoint = 'http://20.244.56.144/test/auth';

    const data={
        companyName: 'Sastra University',
  clientID: 'dd08b800-955c-4d11-b0bd-920988ef4e64',
  clientSecret: 'qkyODSfQxXcnCQlv',
  ownerName: 'Tejeswar reddy',
  ownerEmail: 'tejeswar.chinthala@gmail.com',
  rollNo: '125003366'
    }

    try {
        const response = await axios.post(endpoint, data);
        console.log('Company registered successfully:', response.data);
      } catch (error) {
        console.error('Error registering company:', error.response ? error.response.data : error.message);
      }
}


registerCompany();
authourazitionToken();

// api requests 

const PORT = 3001;
const app = express();



const access_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMTM5NzkwLCJpYXQiOjE3MjExMzk0OTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRkMDhiODAwLTk1NWMtNGQxMS1iMGJkLTkyMDk4OGVmNGU2NCIsInN1YiI6InRlamVzd2FyLmNoaW50aGFsYUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJTYXN0cmEgVW5pdmVyc2l0eSIsImNsaWVudElEIjoiZGQwOGI4MDAtOTU1Yy00ZDExLWIwYmQtOTIwOTg4ZWY0ZTY0IiwiY2xpZW50U2VjcmV0IjoicWt5T0RTZlF4WGNuQ1FsdiIsIm93bmVyTmFtZSI6IlRlamVzd2FyIHJlZGR5Iiwib3duZXJFbWFpbCI6InRlamVzd2FyLmNoaW50aGFsYUBnbWFpbC5jb20iLCJyb2xsTm8iOiIxMjUwMDMzNjYifQ.DGw7ritVmwU2UOJ8QSTU2tyjEV-e9pzXaPkgZhPoEvM'


const WINDOW_SIZE = 10;
const TEST_SERVER_URL = 'http://20.244.56.144/test'; // Replace with actual test server URL
const TIMEOUT = 500; // 500 milliseconds

let windowNumbers = [];

// Utility function to fetch numbers from the test server
const fetchNumbers = async (type) => {
  try {
    let endpoint;
    switch (type) {
      case 'p':
        endpoint = `${TEST_SERVER_URL}/primes`;
        break;
      case 'f':
        endpoint = `${TEST_SERVER_URL}/fibo`;
        break;
      case 'e':
        endpoint = `${TEST_SERVER_URL}/even`;
        break;
      case 'r':
        endpoint = `${TEST_SERVER_URL}/rand`;
        break;
      default:
        return [];
    }
    const response = await axios.get(endpoint, {headers:{
      'Authorization': `Bearer ${access_token}`
    }, TIMEOUT });
    return response.data.numbers; // Assuming the response is { numbers: [...] }
  } catch (error) {
    console.error(`Error fetching numbers: ${error.message}`);
    return [];
  }
};

// Utility function to calculate average
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  // Validate the numberid
  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  // Fetch numbers from the test server
  const newNumbers = await fetchNumbers(numberid);

  // Ensure uniqueness and update the window
  const uniqueNewNumbers = [...new Set(newNumbers)];
  windowNumbers = [...new Set([...windowNumbers, ...uniqueNewNumbers])];

  // Limit the window size
  if (windowNumbers.length > WINDOW_SIZE) {
    windowNumbers = windowNumbers.slice(windowNumbers.length - WINDOW_SIZE);
  }

  // Calculate the average
  const avg = calculateAverage(windowNumbers);

  // Construct the response
  const response = {
    numbers: uniqueNewNumbers,
    windowPrevState: windowNumbers.slice(0, windowNumbers.length - uniqueNewNumbers.length),
    windowCurrState: windowNumbers,
    avg: parseFloat(avg),
  };

  res.json(response);
});


app.listen(PORT,()=>{
    console.log("app is listening on PORT: ",PORT);
});



