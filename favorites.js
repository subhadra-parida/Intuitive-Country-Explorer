const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const favoritesList = document.getElementById('favoritesList');

function displayFavorites() {
    favorites.forEach(favorite => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${favorite}</td>
            <td><button class="remove-button" data-country="${favorite}">Remove</button></td>
        `;
        favoritesList.appendChild(row);
    });

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromFavorites);
    });
}

// Function to remove from favorites
function removeFromFavorites(event) {
    const countryName = event.target.dataset.country;
    const index = favorites.indexOf(countryName);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        location.reload(); // Refresh the favorites list
    }
}

// Initial display of favorites
displayFavorites();
