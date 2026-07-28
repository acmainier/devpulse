// IIFE - Immediately Invoked Function Expression
// Stops Variables & functions leaking into the global scope
(function () { 

    // Grabs every tab element with matching class, and returns a NodeList.
    const tabs = document.querySelectorAll('.tab');

    // Looks up login & register elements so we can reference them later via login/register forms. 
    const forms = {
        login: document.getElementById('login-form'),
        register: document.getElementById('register-form'),
    };

    // Looks up login & register headers so we can reference them above each form. 
    const headings = {
        login: document.getElementById('login-heading'),
        register: document.getElementById('register-heading'),
    };

    // Store links below each form allowing the user to switch forms and hide the inactive form.
    const switches = {
        login: document.getElementById('login-switch'),
        register: document.getElementById('register-switch'),
    };

    // Shows the success or error message after a form submit is carried out.
    const statusMessage = document.getElementById('status-message');

    // Switches the UI to either Register or Login mode.
    function showMode(mode) {
        // Highlight specific tab button that matches the requested mode.
        tabs.forEach(t => t.classList.toggle('active', t.dataset.target === mode));
        // For both modes show the matching switch text and hide the other one
        Object.keys(forms).forEach(key => {
            forms[key].classList.toggle('active', key === mode);
            headings[key].style.display = key === mode ? '' : 'none';
            switches[key].style.display = key === mode ? '' : 'none';
        });

        // Clear out any leftover messages from switching modes
        statusMessage.classList.remove('show');
        statusMessage.textContent = '';
    }

    // Loop through every tab button and give a click listener
    tabs.forEach(tab => {
        // When this tab is clicked switch the UI to whatever mode it represents
        tab.addEventListener('click', () => showMode(tab.dataset.target));
    });
    
    // Find every link button tag with class name and give a click listener
    document.querySelectorAll('.switch-text .switch-link').forEach(link => {
        link.addEventListener('click', () => {
        // Switch to the mode the link points to
        showMode(link.dataset.target);
        });
    });

    // Displays error message next to the input
    function setError(inputId, message) {
        // find the span for the attribute that matches the input's id - (Template Literal)
        const span = document.querySelector(`[data-error-for="${inputId}"]`);
        // Tries to set text if a matching span value was actually found.
        if (span) span.textContent = message || '';
    }

    // Clears every error message inside the form
    function clearErrors(form) {
        // Finds every element with class name inside the form.
        form.querySelectorAll('.error-text').forEach(span => span.textContent = '');
    }

    // listens for the login form being submitted.
    document.getElementById('login-form').addEventListener('submit', function (e) {
        // Stop the browsers default behaviour for form submission.
        e.preventDefault();

        // Clears any error messages left over.
        clearErrors(this);

        // Tracks whether every check has passed so far.
        let valid = true;

        // Grab the current values typed into the input fields.
        const email = this.email.value.trim();
        const password = this.password.value;

        // Check - Email must not be empty.
        if (!email) {
            setError('login-email', 'Email is required');
            valid = false;
        }

        // Check - Password must be 8 characters long.
        if (password.length < 8) {
            setError('login-password', 'Password must be at least 8 characters');
            valid = false;
        }

        // Only show success message if every check passed.
        if (valid) {
            statusMessage.textContent = 'Logged in successfully.';
            statusMessage.classList.add('show');
        }
    });

    // Listen for the register form submission.
    document.getElementById('register-form').addEventListener('submit', function (e) {
        // Stop the browsers default submission.
        e.preventDefault();

        // Clear leftover error messages.
        clearErrors(this);

        // Tracks every check has been passed.
        let valid = true;

        // Grab current values from each input entered.
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const password = this.password.value;
        const confirm = this.confirm.value;

        // Check - name must not be empty.
        if (!name) {
            setError('register-name', 'Name is required.');
            valid = false;
        }

        // Check - email must not be empty.
        if (!email) {
            setError('register-email', 'Email is required.');
            valid = false;
        }

        // Check - password must be at least 8 characters.
        if (password.length < 8) {
            setError('register-password', 'Password must be 8 characters minimum.');
            valid = false;
        }

        // Check - Confirm passwords match.
        if (confirm !== password || !confirm) {
            setError('register-confirm', 'Passwords do not match.');
            valid = false;
        }

        // Check - terms checkbox must be ticked.
        if (!this.terms.checked) {
            valid = false;
            statusMessage.textContent = 'Please agree to the Terms & Privacy Policy.';
            statusMessage.classList.add('show');
            return;
        }

        // Show a success message only if every check passed.
        if (valid) {
            statusMessage.textContent = 'Account created successfully.';
            statusMessage.classList.add('show');
        }
    });
})();
