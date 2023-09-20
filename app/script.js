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

            const modal = document.getElementById('errorModal');
            const errorMessageElement = document.getElementById('errorMessage');

            // Function to open the modal with an error message
            function openErrorModal(errorMessage) {
                errorMessageElement.textContent = errorMessage;
                modal.style.display = 'block';
            }

            // Function to close the modal
            function closeErrorModal() {
                modal.style.display = 'none';
            }

            // Event listener to open the modal when the button is clicked
            openErrorModal(error);

            // Event listener to close the modal when the close button is clicked
            modal.querySelector('.close').addEventListener('click', closeErrorModal);

            // Event listener to close the modal when the user clicks outside the modal content
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeErrorModal();
                }
            });


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