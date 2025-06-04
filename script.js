document.addEventListener('DOMContentLoaded', function() {
    const appsScriptURL = 'https://script.google.com/macros/s/AKfycbwsOn_YLCNKVj4vC5CShdNmLabIes8kD2ieUoFAed2d0AnRysB7OHv1v3uETyu-7u-c4A/exec'; // <--- IMPORTANT: REPLACE WITH YOUR DEPLOYED APPS SCRIPT URL

    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const visitorCountElement = document.getElementById('visitorCount');

    // Social share buttons (retrieved after confirmation message is visible)
    let shareFacebook;
    let shareLinkedIn;
    let shareInstagram;

    // --- Visitor Counter Logic ---
    function updateVisitorCount() {
        fetch(appsScriptURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && typeof data.count === 'number') {
                    visitorCountElement.textContent = data.count;
                } else {
                    visitorCountElement.textContent = 'N/A';
                    console.error('Invalid visitor count data received:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                visitorCountElement.textContent = 'Error';
            });
    }

    // Initial visitor count fetch
    updateVisitorCount();

    // Optional: Update count periodically, e.g., every minute
    // setInterval(updateVisitorCount, 60000); 

    // --- Form Submission Logic ---
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value;

        // Basic client-side email validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            return;
        }

        const formData = {
            email: email
        };

        // Show a temporary loading state or disable button
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        fetch(appsScriptURL, {
            method: 'POST',
            mode: 'no-cors', // Required for simple Apps Script POST
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Or 'application/json' if your Apps Script is parsing as JSON
            },
            body: JSON.stringify(formData) // Sending as JSON for Apps Script to parse
        })
        .then(response => {
            // Because of 'no-cors', response.ok will always be false.
            // We rely on the Apps Script's side logging for actual success/failure.
            // We just assume success from client side after a successful fetch.
            showConfirmation(email);
        })
        .catch(error => {
            console.error('Error during form submission:', error);
            alert('An error occurred during submission. Please try again.');
            submitButton.textContent = 'Get Early Access';
            submitButton.disabled = false;
        });
    });

    // --- Show Confirmation Message & Setup Social Sharing ---
    function showConfirmation(email) {
        signupForm.classList.add('hidden');
        confirmationMessage.classList.remove('hidden');
        emailInput.value = ''; // Clear email field

        // Update the confirmation message text
        const confirmationTextElement = confirmationMessage.querySelector('p:first-of-type');
        if (confirmationTextElement) {
            confirmationTextElement.innerHTML = `🚀 Awesome! Your journey with Odd Won Out has begun. We've received your email and sent a confirmation to your inbox!`;
        }

        // Initialize social share buttons after confirmation message is visible
        shareFacebook = document.getElementById('shareFacebook');
        shareLinkedIn = document.getElementById('shareLinkedIn');
        shareInstagram = document.getElementById('shareInstagram');


        // --- Social Sharing Setup ---
        // The URL of your live Odd Won Out signup page (will be dynamically pulled by window.location.href)
        const shareURL = encodeURIComponent(window.location.href);

        // The pre-filled message you want to share
        const prefilledShareMessage = "Just signed up for Odd Won Out (OWO)! Excited to uncover true potential in academics and career. Join me!";
        const encodedShareMessage = encodeURIComponent(prefilledShareMessage);

        // Hashtags for Facebook (can be modified)
        const facebookHashtag = encodeURIComponent("#OddWonOut #OWO #CareerGuidance #StudentSuccess");


        // 1. Instagram Share (still requires manual copy-paste for text)
        // Instagram's sharing APIs are primarily for sharing media, not pre-filling text posts.
        // We'll give the user a prompt to copy the text.
        shareInstagram.href = `https://www.instagram.com/direct/inbox/`; // Or link to your Insta profile if preferred
        shareInstagram.onclick = (e) => {
             e.preventDefault(); // Prevent default navigation to allow alert
             alert(`For Instagram, you'll usually copy the message and paste it into your post/story after uploading an image!\n\nMessage: ${prefilledShareMessage}\n\nLink: ${decodeURIComponent(shareURL)}`);
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