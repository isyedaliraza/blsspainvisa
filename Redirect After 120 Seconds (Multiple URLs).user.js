// ==UserScript==
// @name         Redirect After 120 Seconds (Multiple URLs)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects back to the previous page after 120 seconds if no action is taken, for specific URLs.
// @author       YourName
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment?appointmentFor=Individual&applicantsNo=1&visaType=c521a435-b204-4551-8138-98167a065696&visaSubType=42923c19-5005-46e0-aa0a-b006ff301c26&appointmentCategory=5c2e8e01-796d-4347-95ae-0c95a9177b26&location=c652d499-fa90-4f96-9d16-3946efe95fa9&data=*
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment?appointmentFor=Individual&applicantsNo=1&visaType=e8e10f04-0f2d-4a4f-9712-f1c4558d2751&visaSubType=7b3d2b79-7108-495d-bb73-5b5fe9e78c29&appointmentCategory=5c2e8e01-796d-4347-95ae-0c95a9177b26&location=20ef00f2-5539-4814-bdc6-04295095be79&data=*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Time to wait before redirecting (120 seconds)
    const WAIT_TIME = 120 * 1000; // 120 seconds in milliseconds

    // URL to redirect to (previous page or fallback URL)
    const REDIRECT_URL = document.referrer || 'https://pakistan.blsspainglobal.com/Global/blsAppointment'; // Previous page or fallback URL

    // Flag to track if the user takes action (e.g., clicking a button)
    let isActionTaken = false;

    // Debugging log to confirm script activation
    console.log("Script active on this specific page.");

    // Add an event listener to track button clicks or user actions
    document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        // Example: Adjust selectors to match relevant buttons or actions
        if (clickedElement && clickedElement.matches('.submit-appointment, #submitButton, .agree-consent, #agreeButton')) { // Replace with actual selectors if needed
            isActionTaken = true;
            console.log('User action detected. Redirection canceled.');
        }
    });

    // Start the timer
    console.log(`Page will redirect to ${REDIRECT_URL} in ${WAIT_TIME / 1000} seconds unless an action is detected.`);

    // Schedule the redirection
    setTimeout(() => {
        if (!isActionTaken) {
            console.log(`No user action detected. Redirecting to: ${REDIRECT_URL}`);
            window.location.href = REDIRECT_URL; // Redirect to the previous page
        } else {
            console.log('User action detected. Redirection canceled.');
        }
    }, WAIT_TIME);
})();