/**
 * Import function triggers from the Firebase Functions SDK.
 */
const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require('firebase-functions/params');
const cors = require('cors')({origin: true});

/**
 * Import the GoogleGenerativeAI library for Gemini.
 */
const {GoogleGenerativeAI} = require("@google/generative-ai");

// Define the Gemini API key as a secret parameter.
const GEMINI_API_KEY = defineString("GEMINI_API_KEY");

// Initialize the Gemini client with the API key.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

/**
 * A secure, HTTP-callable Cloud Function to get menu recommendations.
 * This version uses onRequest and the cors middleware to handle CORS correctly.
 */
exports.getMenuRecommendations = onRequest((request, response) => {
  // Use the cors middleware to handle the preflight request and add necessary headers.
  cors(request, response, async () => {
    // Check for POST request
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    try {
      // The actual data is in request.body for onRequest functions
      const { task, siteHtml, menuData, activeKeywords } = request.body;

      let parsedMenu = menuData;

      // Task 1: If the menu hasn't been parsed yet today.
      if (task === 'parseAndRecommend') {
        const parsePrompt = `
          You are a menu parsing assistant. Analyze the provided HTML and extract the weekly menu.
          Return a single JSON object with keys "HUB 1", "HUB 2", "HUB 3", and "Foodcore".
          For "HUB 1", "HUB 2", and "HUB 3", the value should be an object mapping each day ("Mandag" to "Fredag") to its dish.
          "HUB 1" is the first main column, "HUB 2" is the second, and "HUB 3" is the "Kays" menu.
          For "Foodcore", the value should be an object mapping each day to another object containing "Globetrotter" and "Homebound" dishes.
          Here is the HTML: --- ${siteHtml} ---
        `;
        const parseResult = await model.generateContent(parsePrompt);
        const responseText = await parseResult.response.text();
        parsedMenu = JSON.parse(responseText.replace(/```json\n/g, '').replace(/```/g, ''));
      }

      // Task 2: Get recommendations based on the (now parsed) menu and preferences.
      const recommendPrompt = `
        Given the following JSON menu: --- ${JSON.stringify(parsedMenu)} ---
        And the user's food preferences in order of priority: --- ${activeKeywords} ---
        Return a JSON object mapping each day ("Mandag" to "Fredag") to the name of the recommended cafeteria.
        The recommendation should be the first dish found for a day that matches a keyword.
        If no match is found for a day, the value should be "Any".
      `;
      const recommendResult = await model.generateContent(recommendPrompt);
      const recommendationsText = await recommendResult.response.text();
      const recommendations = JSON.parse(recommendationsText.replace(/```json\n/g, '').replace(/```/g, ''));

      // Send the successful response back to the client.
      response.status(200).json({
        menu: parsedMenu,
        recommendations: recommendations,
      });

    } catch (error) {
      console.error("Error in Cloud Function:", error);
      response.status(500).send("An internal error occurred.");
    }
  });
});
