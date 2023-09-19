// Function to send the API request
function sendApiRequest(checkedCheckboxes) {
    const apiUrl = '/set';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkedCheckboxes }),
    })
        .then(response => {
            if (response.ok) {
                console.log('API request sent successfully.');
            } else {
                console.error('Failed to send API request.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const imageContainers = document.querySelectorAll('.img-container');
imageContainers.forEach(container => {
    container.addEventListener('click', () => {
        // Toggle the associated checkbox's state when the container is clicked
        const checkbox = container.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        const checkedCheckboxes = [];
        
        // Iterate through the checkboxes to find the checked ones
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                checkedCheckboxes.push(checkbox.id);
            }
        });
        
        // Call the function to send the API request with the checked checkboxes
        sendApiRequest(checkedCheckboxes);
    });

});