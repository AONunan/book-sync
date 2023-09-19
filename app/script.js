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

const searchInput = document.getElementById("search");
const flexContainer = document.getElementById("book-container");
const flexItems = flexContainer.getElementsByClassName("flex-item");

searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    // Loop through the div flexItems and hide/show them based on the search text
    for (const item of flexItems) {
        const text = item.textContent.toLowerCase(); // Get the text content of the item
        if (text.includes(searchText)) {
            item.style.display = "block"; // Show matching flexItems
        } else {
            item.style.display = "none"; // Hide non-matching flexItems
        }
    }
});