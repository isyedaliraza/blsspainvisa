// ==UserScript==
// @name         X Continuous 25% Form Auto-Filler with Direct Submission Call and Logs
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Fills the form at 25% progress and directly calls the OnApplicationSubmit function after selections, with logging.
// @author       MR Tech
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment*
// @match        https://pakistan.blsspainglobal.com/Global/*/ManageAppointment*
// @match        https://pakistan.blsspainglobal.com/Global/*/manageAppointment*
// @match        http://localhost/bls/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define user-modifiable values
    const surname = "younas";
    const placeOfBirth = "gujrat";
    const nationalityIndex = 165; // Index for Pakistan
    const nationalityatbirth = 165; // index for pakistan
    const countryOfBirthIndex = 165; // Index for Pakistan
    const genderIndex = 1; // Index for Male (0 = Male, 1 = Female)
    const maritalStatusIndex = 4; // Index for Single (4 = Single)

    console.log("Script started. Checking for progress at 25%...");

    // Function to check if progress is 25%
    function checkProgress() {
        const progressElement = document.querySelector('#progress-percent');
        if (progressElement && progressElement.textContent.trim() == '25%') {
            console.log("Progress is at 25%. Proceeding with form filling.");
            fillForm();
        } else {
            console.log("Progress is not at 25%. Checking again in 3 seconds...");
            setTimeout(checkProgress, 3000); // Recheck every 3 seconds
        }
    }

    // Function to fill the form
    async function fillForm() {
        try {
            // Fill in the surname
            const surnameField = await waitForElement('#SurnameAtBirth_0');
            if (surnameField) {
                surnameField.value = surname;
                console.log("Surname filled:", surname);
            } else {
                console.error("Surname field not found.");
            }

            // Fill in the place of birth
            const placeOfBirthField = await waitForElement('#PlaceOfBirth_0');
            if (placeOfBirthField) {
                placeOfBirthField.value = placeOfBirth;
                console.log("Place of birth filled:", placeOfBirth);
            } else {
                console.error("Place of birth field not found.");
            }

            // Select nationality
            await selectDropdown('NationalityId', nationalityIndex, "Nationality");

            // Select country of birth
            await selectDropdown('CountryOfBirthId', countryOfBirthIndex, "Country of Birth");

            // Select gender
            await selectDropdown('GenderId', genderIndex, "Gender");

            // Select marital status
            await selectDropdown('MaritalStatusId', maritalStatusIndex, "Marital Status");

            // After filling the form, directly submit
            submitForm();

        } catch (error) {
            console.error("An error occurred while filling the form:", error);
        }
    }

    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) { // Ensures element is visible
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(`Element ${selector} not found within ${timeout}ms.`);
                } else {
                    setTimeout(checkElement, 100); // Keep checking every 100ms
                }
            };
            checkElement();
        });
    }

    // Function to select dropdown options by index
    async function selectDropdown(prefix, index, label) {
        try {
            let selectedElement = null;
            for (let i = 0; i <= 10; i++) {
                const labelElement = await waitForElement(`#${prefix}_${i}_label`);
                if (labelElement && labelElement.offsetParent !== null) {
                    console.log(`${label} dropdown found with label ID: ${labelElement.id}`);
                    selectedElement = labelElement;
                    break;
                }
            }

            if (selectedElement) {
                const dropdown = selectedElement.parentElement.querySelector('span.k-select');
                if (dropdown) {
                    dropdown.click();
                    setTimeout(() => {
                        const options = document.querySelectorAll(`#${prefix}_0_listbox .k-item`);
                        if (options[index]) {
                            options[index].click();
                            console.log(`${label} selected at index: ${index}`);
                        } else {
                            console.error(`${label} option at index ${index} not found.`);
                        }
                    }, 500); // Small delay to allow dropdown to open
                } else {
                    console.error(`${label} dropdown not found.`);
                }
            } else {
                console.error(`${label} dropdown label not found.`);
            }
        } catch (error) {
            console.error(`An error occurred while selecting ${label}:`, error);
        }
    }

    // New function to directly submit the form
    function submitForm() {
        try {
            console.log("Preparing to submit the form...");

            // Find the submit button based on provided criteria
            const submitButton = document.querySelector('button[type="submit"].btn.btn-primary[onclick="return OnApplicationSubmit(event)"]');
            if (submitButton) {
                console.log("Submit button found. Clicking the submit button...");
                setTimeout(() => {
                    submitButton.click();  // Adding a small delay before the click for stability
                    console.log("Form submitted by clicking the submit button.");
                }, 1000);  // 1-second delay before submitting the form
            } else {
                console.error("Submit button not found.");
            }

        } catch (error) {
            console.error("An error occurred while trying to submit the form:", error);
        }
    }

    // Start checking the progress
    checkProgress();

})();
