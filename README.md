# Welcome to the Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations course. This practicum is one of two requirements for receiving your Integrating With HubSpot I: Foundations certification. You must also take the exam and receive a passing grade (at least 75%).

To read the full directions, please go to the [practicum instructions](https://app.hubspot.com/academy/l/tracks/1092124/1093824/5493?language=en).

**Put your HubSpot developer test account custom objects URL link here:** [app.hubspot.com/contacts/149199646/objects/2-254130055/views/all/list](https://app.hubspot.com/contacts/149199646/objects/2-254130055/views/all/list)

---

## Tips:

- Commit to your repository often. Even if you make small tweaks to your code, it’s best to be committing to your repository frequently.
- The subject of the custom object is up to you. Feel free to get creative!
- Ensure you re-merge any working branches into the main branch.
- DO NOT ADD YOUR PRIVATE APP TOKEN TO YOUR REPOSITORY.

## Pre-requisites:

- Using [Node](https://nodejs.org/en/download) and node packages
- Using [Express](https://expressjs.com/en/starter/installing.html)
- Using [Axios](https://axios-http.com/docs/intro)
- Using [Pug templating system](https://pugjs.org/api/getting-started.html)
- Using the command line
- Using [Git and GitHub](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

## Requirements

- All work must be your own. During the grading process we will check the revision history. Submissions that do not meet this requirement will not be considered.
- You must have at least three routes in `index.js`: `GET /`, `GET /update-cobj`, and `POST /update-cobj`.
- You must create two Pug templates: `views/homepage.pug` and `views/updates.pug`.
- The custom object must have at least three properties, including the string property `Name`, and at least three records.
- The custom object must be associated with contacts.
- The README must link to the custom object list in your developer test account.
- Never commit the private app access token. Keep it in a local `.env` file.

## Run locally

Create a local `.env` file with `HUBSPOT_ACCESS_TOKEN=your-private-app-token`, then run `npm install` and `node index.js`. Open `http://localhost:3000` in your browser.

Run the automated route tests with `npm test`.
