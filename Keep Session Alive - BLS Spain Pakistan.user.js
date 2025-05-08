// ==UserScript==
// @name         Keep Session Alive - BLS Spain Pakistan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent session timeout on BLS Spain Pakistan appointment page.
// @author       YourName
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment?*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // URL to send a request to keep the session alive
    const KEEP_ALIVE_URL = "https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment?appointmentFor=Individual&applicantsNo=1&visaType=c521a435-b204-4551-8138-98167a065696&visaSubType=42923c19-5005-46e0-aa0a-b006ff301c26&appointmentCategory=5c2e8e01-796d-4347-95ae-0c95a9177b26&location=c652d499-fa90-4f96-9d16-3946efe95fa9"; // Replace this with the correct URL if needed

    // Interval to send requests (e.g., every 1 minutes = 60000 ms)
    const INTERVAL = 3 * 60 * 1000;

    function keepSessionAlive() {
        console.log("Sending keep-alive request...");

        fetch(KEEP_ALIVE_URL, {
            method: 'GET',
            credentials: 'include', // Ensures cookies and session data are sent
        })
        .then(response => {
            if (response.ok) {
                console.log("Session refreshed successfully.");
            } else {
                console.warn("Failed to refresh session. Response status:", response.status);
            }
        })
        .catch(error => {
            console.error("Error refreshing session:", error);
        });
    }

    // Run the function periodically
    setInterval(keepSessionAlive, INTERVAL);

    // Trigger the function once when the script starts
    keepSessionAlive();
})();