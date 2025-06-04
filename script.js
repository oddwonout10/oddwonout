document.addEventListener('DOMContentLoaded', () => {
    // --- Get all necessary DOM elements ---
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const shareInstagram = document.getElementById('shareInstagram');
    const shareFacebook = document.getElementById('shareFacebook');
    const shareLinkedIn = document.getElementById('shareLinkedIn');
    const visitorCountSpan = document.getElementById('visitorCount'); // Element for visitor counter

    // --- Google Apps Script URL (Unified) ---
    // Make sure this is the CORRECT and LATEST Web App URL from your Apps Script deployment!
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsOn_YLCNKVj4vC5CShdNmLabIes8kD2ieUoFAed2d0AnRysB7OHv1v3uETyu-7u-c4A/exec'; // Your POST URL

    // --- Visitor Counter Logic ---
    async function updateVisitorCount() {
        try {
            // We make a GET request to the same Apps Script URL
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'GET', // Use GET for the counter
                mode: 'cors'   // Use 'cors' because we expect a JSON response and it's a GET
            });

            if (!response.ok) {
                console.error('Failed to fetch visitor count. Status:', response.status);
                visitorCountSpan.textContent = 'Error loading count.';
                return;
            }
            
            const data = await response.json();
            if (data && data.count !== undefined) {
                visitorCountSpan.textContent = data.count;
            } else {
                console.error('Invalid response from Apps Script for visitor count:', data);
                visitorCountSpan.textContent = 'N/A';
            }
        } catch (error) {
            console.error('Error fetching visitor count:', error);
            visitorCountSpan.textContent = 'Offline';
        }
    }

    // Call the function to update the counter when the page loads
    updateVisitorCount();

    // --- Email Form Submission Logic ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        emailError.textContent = ''; // Clear previous errors
        emailInput.classList.remove('error-input'); // Remove error styling

        const email = emailInput.value.trim();

        // Basic email validation
        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('error-input'); // Add error styling
            return;
        }

        // Disable button to prevent multiple submissions
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Signing up...';

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Use 'no-cors' for simple requests to Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            // Since we're using 'no-cors', we can't directly check response.ok or response.json()
            // The success confirmation is shown assuming the fetch request was sent.
            // The actual email sent status is only visible in Apps Script logs.
            showConfirmation(email);

        } catch (error) {
            console.error('Error submitting email:', error);
            emailError.textContent = 'Oops! Something went wrong. Please try again later.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Me Up!';
        }
    });

    // --- Helper Functions ---
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showConfirmation(email) {
        signupForm.classList.add('hidden');
        confirmationMessage.classList.remove('hidden');
        emailInput.value = ''; // Clear email field

        // Update the confirmation message text to indicate email attempt
        const confirmationTextElement = confirmationMessage.querySelector('p:first-of-type'); 
        if (confirmationTextElement) {
            confirmationTextElement.innerHTML = `🚀 Awesome! Your journey with Career Compass has begun. We've received your email and sent a confirmation to your inbox!`;
        }

        // --- Social Sharing Setup ---
        // This is the URL you want people to share.
        // Once your page is live, use its full URL (e.g., 'https://yourcareerservice.com/signup')
        const shareURL = encodeURIComponent(window.location.href); 
        const customMessage = "Just signed up for Career Compass and I'm so excited to navigate my path to success! Check out their amazing services!";
        const encodedMessage = encodeURIComponent(customMessage);
        const facebookHashtag = encodeURIComponent("#CareerCompass #UnlockPotential"); 

        // Instagram (still tricky for pre-filling text directly)
        shareInstagram.href = `https://www.instagram.com/direct/inbox/`;
        shareInstagram.onclick = () => {
             alert(`For Instagram, you'll usually copy the message and paste it into your post/story after uploading an image!\n\nMessage: ${customMessage}\n\nLink: ${decodeURIComponent(shareURL)}`);
             return false;
        };

        // Facebook Share Dialog
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${shareURL}&quote=${encodedMessage}&hashtag=${facebookHashtag}`;

        // LinkedIn Share
        shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareURL}&summary=${encodedMessage}&title=${encodeURIComponent('Career Compass - Unlock Your Potential!')}`;
        // Update the confirmation message text
        const confirmationTextElement = confirmationMessage.querySelector('p:first-of-type');
        if (confirmationTextElement) {
            confirmationTextElement.innerHTML = `🚀 Awesome! Your journey with OddWonOut has begun. We've received your email and sent a confirmation to your inbox!`;
        }

        // --- Social Sharing Setup ---
        // The URL of your live Odd Won Out signup page (will be dynamically pulled by window.location.href)
        const shareURL = encodeURIComponent(window.location.href);

        // The pre-filled message you want to share
        const prefilledShareMessage = "Just signed up for OddWonOut (OWO)! Excited to uncover true potential in academics and career. Join me!";
        const encodedShareMessage = encodeURIComponent(prefilledShareMessage);

        // Hashtags for Facebook/Twitter (can be modified)
        const facebookHashtag = encodeURIComponent("#OddWonOut #OWO #CareerGuidance #StudentSuccess");


        // 1. Instagram Share (still requires manual copy-paste for text)
        // Instagram's sharing APIs are primarily for sharing media, not pre-filling text posts.
        // We'll give the user a prompt to copy the text.
        shareInstagram.href = `https://www.instagram.com/direct/inbox/`; // Or link to your Insta profile if preferred
        shareInstagram.onclick = () => {
             alert(`For Instagram, you'll usually copy the message and paste it into your post/story after uploading an image!\n\nMessage: ${prefilledShareMessage}\n\nLink: ${decodeURIComponent(shareURL)}`);
             return false; // Prevents navigation if alert is shown
        };

        // 2. Facebook Share Dialog
        // Uses the sharer.php endpoint which supports 'u' (URL) and 'quote' (pre-filled text)
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${shareURL}&quote=${encodedShareMessage}&hashtag=${facebookHashtag}`;

        // 3. LinkedIn Share
        // Uses the share-offsite endpoint. 'url' is your page link, 'summary' is the pre-filled text.
        shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareURL}&summary=${encodedShareMessage}&title=${encodeURIComponent('Odd Won Out (OWO) - Uncover Your Potential!')}`;
        // You can also add a 'source' parameter if you want to identify your app/site as the source of the share.
    }
});