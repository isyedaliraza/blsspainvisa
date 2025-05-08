// ==UserScript==
// @name         Image Uploader Spain V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       Mr.uumar +92 3136444101
// @match        https://pakistan.blsspainglobal.com/Global/blsappointment/manageappointment*
// @match        https://pakistan.blsspainglobal.com/*/blsappointment/manageappointment*/*
// @match        https://pakistan.blsspainglobal.com/Global/blsappointment/manageappointment*
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Image Uploader Script started.");

    // Define the image URL to upload
    const imageUrl = 'https://i.postimg.cc/sXND1X57/Sania.jpg';
    console.log("Image URL set to:", imageUrl);

    // Check if the progress is at 0%
    if (document.querySelector('#progress-percent').textContent == '0%') {
        console.log("Progress is at 0%. Proceeding with image upload.");

        // Call the image upload function
        uploadImage();
    } else {
        console.log("Progress is not at 0%. Skipping image upload.");
    }

    function uploadImage() {
        console.log("Entering uploadImage function.");

        // Check if the file input element exists
        const fileInput = document.getElementById('uploadfile-1');
        if (!fileInput) {
            console.error('File input not found! Aborting upload.');
            return;
        }
        console.log("File input found:", fileInput);

        // Create an XMLHttpRequest to fetch the image as a blob
        const xhr = new XMLHttpRequest();
        console.log("Starting XMLHttpRequest to fetch image.");
        xhr.open("GET", imageUrl, true);
        xhr.responseType = "blob";

        xhr.onload = function() {
            console.log("Image fetched. Status:", xhr.status);

            if (xhr.status === 200) {
                const blob = xhr.response;
                console.log("Image fetched successfully as blob:", blob);

                const formData = new FormData();
                formData.append('file', blob, "image.jpg");
                console.log("FormData created with blob.");

                // Perform an AJAX request to upload the image
                console.log("Starting AJAX request to upload the image.");
                $.ajax({
                    url: "/Global/query/UploadProfileImage",
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(result) {
                        console.log("AJAX request successful. Result:", result);

                        if (result.success) {
                            console.log("Image uploaded successfully. File ID:", result.fileId);

                            // Set the preview and hidden input after successful upload
                            $("#uploadfile-1-preview").attr("src", "/Global/query/getfile?fileid=" + result.fileId);
                            $("#ApplicantPhotoId").val(result.fileId);
                            console.log("Preview image and hidden input updated.");

                            // Mark image upload as verified in localStorage
                            localStorage.setItem('imageVerified', 'true');
                            console.log("Image upload verified. Stored verification.");

                            // After successful upload, wait for and click the "I agree" button
                            waitForAgreeButton();
                        } else {
                            console.error("Image upload failed:", result.err);
                            alert('Image upload failed: ' + result.err);
                        }
                    },
                    error: function(err) {
                        console.error('AJAX error:', err);
                        alert('Failed to upload the image due to an AJAX error.');
                    }
                });
            } else {
                console.error('Failed to retrieve the image from the URL. Status:', xhr.status);
                alert('Failed to retrieve the image from the URL.');
            }
        };

        // If the image URL is valid, send the request to fetch the image
        if (imageUrl.length > 0) {
            console.log("Sending XMLHttpRequest to fetch the image.");
            xhr.send();
        } else {
            console.error("No image URL specified. Aborting upload.");
            alert('No image URL specified.');
        }
    }

    // Function to wait for the "I agree" button and click it once visible
    function waitForAgreeButton() {
        const agreeButton = document.querySelector('button.btn-success[onclick="onAgree()"]');
        if (agreeButton) {
            console.log("'I agree' button found. Waiting for it to become visible.");

            // Create an interval to keep checking if the button is visible
            const interval = setInterval(function() {
                if (agreeButton.offsetParent !== null) {
                    console.log("'I agree' button is now visible. Clicking it.");
                    agreeButton.click();
                    clearInterval(interval); // Stop the interval after clicking
                } else {
                    console.log("'I agree' button is not visible yet. Waiting...");
                }
            }, 500); // Check every 500 milliseconds
        } else {
            console.error("'I agree' button not found.");
        }
    }

    console.log("Image Uploader Script execution finished.");
})();
