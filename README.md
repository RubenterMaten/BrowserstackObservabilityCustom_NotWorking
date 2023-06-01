# Setup
1. Do a checkout on the repository
2. Upload the app found in the "apps" folder to [Browserstack](https://www.browserstack.com/docs/app-automate/api-reference/appium/apps#upload-an-app). **Make sure to save the URL.**
3. Set up the following fields in the "RunManager" class:
-	A valid “browserstackUser”
-	The browserstack key belonging to said user
-	The browserstack url of the app in test

# Run
Run the test with the following command:
`npm run test`
