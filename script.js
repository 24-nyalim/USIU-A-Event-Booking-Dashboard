document.addEventListener('DOMContentLoaded', () => {
    // --- Data Persistence and Initialization ---
    // Check if event data exists in localStorage, otherwise use default data
    const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [
        { name: 'Tech Symposium', slots: 50 },
        { name: 'Career Fair', slots: 150 },
        { name: 'Drama Festival', slots: 75 },
        { name: 'Open Mic Night', slots: 30 },
        { name: 'Sports Day', slots: 200 }
    ];

    // Function to update the DOM with the current event data
    function renderEvents() {
        const tableRows = document.querySelectorAll('#event-table tbody tr');
        const formSelect = document.getElementById('eventSelect');
        formSelect.innerHTML = '<option value="">--Select an event--</option>'; // Reset the dropdown

        tableRows.forEach(row => {
            const eventName = row.dataset.event;
            const slotsElement = row.querySelector('.slots');
            const registerBtn = row.querySelector('.register-btn');
            const event = eventsData.find(e => e.name === eventName);

            if (event) {
                slotsElement.textContent = event.slots;
                // Add event to dropdown
                const option = document.createElement('option');
                option.value = event.name;
                option.textContent = event.name;
                formSelect.appendChild(option);

                // Handle button state
                if (event.slots <= 0) {
                    registerBtn.disabled = true;
                    registerBtn.textContent = 'Fully Booked';
                } else {
                    registerBtn.disabled = false;
                    registerBtn.textContent = 'Register';
                }
            }
        });
    }

    // Function to save event data to localStorage
    function saveEvents() {
        localStorage.setItem('eventsData', JSON.stringify(eventsData));
    }

    // Initial render
    renderEvents();

    // --- Event Listener for Table Register Buttons ---
    const tableBody = document.querySelector('#event-table tbody');
    const registrationMessage = document.getElementById('registration-message');

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('register-btn')) {
            const row = e.target.closest('tr');
            const eventName = row.dataset.event;
            const slotsElement = row.querySelector('.slots');

            // Find the event in our data array
            const event = eventsData.find(e => e.name === eventName);

            if (event && event.slots > 0) {
                event.slots--; // Decrease slots
                slotsElement.textContent = event.slots; // Update the DOM
                saveEvents(); // Save the new data to localStorage

                // Display success message
                registrationMessage.textContent = `${eventName} - Your booking was successful! Slots remaining: ${event.slots}`;
                registrationMessage.style.color = '#155724';
                registrationMessage.style.backgroundColor = '#d4edda';

                // Check if now fully booked
                if (event.slots === 0) {
                    e.target.disabled = true;
                    e.target.textContent = 'Fully Booked';
                }
            }
        }
    });

    // --- Event Listener for Booking Form ---
    const bookingForm = document.getElementById('booking-form');
    const formConfirmation = document.getElementById('form-confirmation');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        const name = document.getElementById('name').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const selectedEvent = document.getElementById('eventSelect').value;

        // Validation
        if (!name || !studentId || !selectedEvent) {
            formConfirmation.textContent = 'Please fill out all fields.';
            formConfirmation.style.color = '#721c24';
            formConfirmation.style.backgroundColor = '#f8d7da';
            return;
        }

        // Student ID format validation
        const studentIdRegex = /^[0-9]{5,8}$/;
        if (!studentIdRegex.test(studentId)) {
            formConfirmation.textContent = 'Invalid Student ID format. Must be 5-8 digits.';
            formConfirmation.style.color = '#721c24';
            formConfirmation.style.backgroundColor = '#f8d7da';
            return;
        }

        // Find the event and decrease its slots
        const event = eventsData.find(e => e.name === selectedEvent);
        if (event && event.slots > 0) {
            event.slots--;
            saveEvents();
            renderEvents(); // Update the table and dropdown

            // Display confirmation message
            formConfirmation.textContent = `Hello, ${name} (ID: ${studentId}), your registration for "${selectedEvent}" is confirmed.`;
            formConfirmation.style.color = '#155724';
            formConfirmation.style.backgroundColor = '#d4edda';

            bookingForm.reset(); // Clear the form
        } else if (event && event.slots === 0) {
            formConfirmation.textContent = `Sorry, "${selectedEvent}" is fully booked.`;
            formConfirmation.style.color = '#721c24';
            formConfirmation.style.backgroundColor = '#f8d7da';
        }
    });
});