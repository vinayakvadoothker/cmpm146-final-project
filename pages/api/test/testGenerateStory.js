const axios = require('axios');

// Define the API URL
const API_URL = 'http://localhost:3000/api/generateStory'; // Adjust the URL if needed

// Define the test data for the first-time user
const testData = {
  userInput: "", // No specific user input needed for first-time visit
  currentStep: 0,
  story: [],    // Empty story for the initial call
  isFirstVisit: true // Flag indicating it's the first visit
};

// Function to test the generateStory API for first-time users
async function testGenerateStory() {
  try {
    // Make the API request
    const response = await axios.post(API_URL, testData);
    
    // Log the response
    console.log('API Response:', response.data);

    // Optional: Check for specific response content or structure
    if (response.data.narrative && response.data.choices) {
      console.log('Test Passed');
    } else {
      console.log('Test Failed: Unexpected response structure');
    }
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

// Run the test
testGenerateStory();
