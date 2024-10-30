const countryList = document.getElementById('countryList');
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const loadMoreButton = document.getElementById('loadMore');
const favoritesSection = document.getElementById('favorites');
const favoritesList = document.getElementById('favoritesList');
const aboutSection = document.getElementById('aboutSection'); // "About" section
const aboutContent = document.getElementById('aboutContent'); // Country details in "About" section
const countryNameElement = document.getElementById('countryName'); // Country name in "About" section

let currentPage = 1;
const pageSize = 12; // Adjust as necessary
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to display country cards
function displayCountries(countries) {
    countryList.innerHTML = ''; // Clear previous cards
    countries.forEach(country => {
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            <h3>${country.name.common}</h3>
        `;
        card.addEventListener('click', () => {
            localStorage.setItem('selectedCountry', JSON.stringify(country)); // Save selected country
            displayCountryDetails(country); // Show country details
        });
        countryList.appendChild(card);
    });
}

// Function to fetch countries from API
async function fetchCountries(page) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        const paginatedCountries = data.slice((page - 1) * pageSize, page * pageSize);
        displayCountries(paginatedCountries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

// Load more countries on button click
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchCountries(currentPage);
});

// Function to search for countries
async function searchCountries(query) {
    if (query) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
            const data = await response.json();
            displayCountries(data);
        } catch (error) {
            console.error('Error searching countries:', error);
        }
    }
}

// Handle search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchCountries(query);
        showSuggestions(query);
    } else {
        suggestions.innerHTML = ''; // Clear suggestions if input is empty
    }
});

// Function to show suggestions
async function showSuggestions(query) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        const data = await response.json();
        suggestions.innerHTML = ''; // Clear previous suggestions
        data.forEach(country => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = country.name.common;
            suggestionItem.addEventListener('click', () => {
                searchInput.value = country.name.common;
                suggestions.innerHTML = ''; // Clear suggestions
                searchCountries(country.name.common);
            });
            suggestions.appendChild(suggestionItem);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Function to display favorites
function displayFavorites() {
    favoritesList.innerHTML = ''; // Clear previous favorites
    if (favorites.length > 0) {
        favoritesSection.style.display = 'block'; // Show favorites section
        favorites.forEach((countryName, index) => {
            const item = document.createElement('div');
            item.className = 'favorites-item';
            item.textContent = countryName;

            // Create a remove button for each favorite
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeFromFavorites(index); // Remove item from favorites
            });

            item.appendChild(removeButton);
            favoritesList.appendChild(item);
        });
    } else {
        favoritesSection.style.display = 'none'; // Hide if no favorites
    }
}

// Function to remove a country from favorites
function removeFromFavorites(index) {
    favorites.splice(index, 1); // Remove country from favorites array
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
    displayFavorites(); // Re-display the updated favorites list
}

// Function to display country details
function displayCountryDetails(country) {
    const detailsHtml = `
        <div>
            <h2>${country.name.common}</h2>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" style="width: 100%;">
            <p><strong>Top Level Domain:</strong> ${country.tld.join(', ')}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Area:</strong> ${country.area} km²</p>
            <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
        </div>
        <div class="country-description">
            <p>${country.name.common} is a beautiful country located in the ${country.region} region. It is known for its capital city ${country.capital}, and has a population of approximately ${country.population.toLocaleString()} people. The country covers an area of ${country.area.toLocaleString()} square kilometers and its official languages include ${Object.values(country.languages).join(', ')}.</p>
        </div>
    `;
    const detailsDiv = document.createElement('div');
    detailsDiv.innerHTML = detailsHtml;
    countryList.innerHTML = ''; // Clear country list
    countryList.appendChild(detailsDiv);

    // Add "Back" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Home';
    backButton.addEventListener('click', () => {
        aboutSection.style.display = 'none'; // Hide the about section
        countryList.innerHTML = ''; // Clear details
        fetchCountries(currentPage); // Load previous countries
        displayFavorites(); // Update favorites
        countryList.style.display = 'block'; // Show country list again
    });
    countryList.appendChild(backButton);

    // Add to favorites functionality
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.addEventListener('click', () => {
        favorites.push(country.name.common); // Add to favorites
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Save to local storage
        showFavoritesPage(); // Immediately navigate to the favorites page
    });
    countryList.appendChild(favoriteButton);
}

// Function to display country-specific About section
function displayAboutSection() {
    const selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));

    if (selectedCountry) {
        countryNameElement.textContent = selectedCountry.name.common; // Set the country name in the "About" section
        aboutContent.innerHTML = `
            <p><strong>Top Level Domain:</strong> ${selectedCountry.tld.join(', ')}</p>
            <p><strong>Capital:</strong> ${selectedCountry.capital}</p>
            <p><strong>Region:</strong> ${selectedCountry.region}</p>
            <p><strong>Population:</strong> ${selectedCountry.population}</p>
            <p><strong>Area:</strong> ${selectedCountry.area} km²</p>
            <p><strong>Languages:</strong> ${Object.values(selectedCountry.languages).join(', ')}</p>
            <div class="country-description">
                <p>${selectedCountry.name.common} is a beautiful country located in the ${selectedCountry.region} region. It is known for its capital city ${selectedCountry.capital}, and has a population of approximately ${selectedCountry.population.toLocaleString()} people. The country covers an area of ${selectedCountry.area.toLocaleString()} square kilometers and its official languages include ${Object.values(selectedCountry.languages).join(', ')}.</p>
            </div>
        `;
    } else {
        aboutContent.innerHTML = '<p>Please select a country to view details.</p>';
    }
}

// Show favorites when clicking the navbar link
document.getElementById('favoritesLink').addEventListener('click', (e) => {
    e.preventDefault();
    favoritesSection.style.display = 'block'; // Show favorites section
    aboutSection.style.display = 'none'; // Hide the about section
    countryList.style.display = 'none'; // Hide the country list
});

// Show About section when clicking the About navbar link
document.getElementById('aboutLink').addEventListener('click', (e) => {
    e.preventDefault();
    displayAboutSection(); // Display country-specific "About" section
    aboutSection.style.display = 'block'; // Show the About section
    countryList.style.display = 'none'; // Hide the country list
    favoritesSection.style.display = 'none'; // Hide the favorites section
});

document.getElementById('backToHome').addEventListener('click', function() {
    // Hide the About section
    document.getElementById('aboutSection').style.display = 'none';
    
    // Show the Home section
    document.getElementById('homeSection').style.display = 'block';
});

document.getElementById('backToHome').addEventListener('click', function() {
    window.location.href = 'index.html';  // Replace 'index.html' with your actual home page URL
});

// Handle "Contact Us" navigation
document.getElementById('contactLink').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Hide other sections
    document.getElementById('countryList').style.display = 'none';
    document.getElementById('aboutSection').style.display = 'none';
    document.getElementById('favorites').style.display = 'none';
    
    // Show the Contact Us section
    document.getElementById('contactSection').style.display = 'block';
});

// Handle "Back to Home" button in Contact Us section
document.getElementById('backToHomeFromContact').addEventListener('click', function() {
    // Hide Contact Us section
    document.getElementById('contactSection').style.display = 'none';
    
    // Show the Home section
    document.getElementById('countryList').style.display = 'block';
});

// Handle form submission (Optional functionality)
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Example alert for form submission
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    
    // Optionally, clear form fields after submission
    document.getElementById('contactForm').reset();
});


// Initialize
fetchCountries(currentPage);
displayFavorites();
