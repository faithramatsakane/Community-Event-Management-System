// ===== EVENTS.JS =====
// Handle events listing, filtering, and event details

let filteredEvents = [];

document.addEventListener('DOMContentLoaded', function() {
  displayAllEvents();
  setupEventFilters();
});

// Display all events
function displayAllEvents() {
  filteredEvents = eventDatabase;
  renderEventsGrid();
}

// Setup event filters
function setupEventFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const dateFilter = document.getElementById('dateFilter');
  const priceFilter = document.getElementById('priceFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      applyFilters();
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      applyFilters();
    });
  }
  
  if (dateFilter) {
    dateFilter.addEventListener('change', function() {
      applyFilters();
    });
  }
  
  if (priceFilter) {
    priceFilter.addEventListener('change', function() {
      applyFilters();
    });
  }
}

// Apply all filters
function applyFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const dateFilter = document.getElementById('dateFilter');
  const priceFilter = document.getElementById('priceFilter');
  
  const criteria = {
    search: searchInput ? searchInput.value : '',
    category: categoryFilter ? categoryFilter.value : '',
    date: dateFilter ? dateFilter.value : '',
    price: priceFilter ? priceFilter.value : ''
  };
  
  filteredEvents = eventDatabase.filter(event => {
    // Search filter
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      if (!event.name.toLowerCase().includes(searchLower) &&
          !event.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Category filter
    if (criteria.category && event.category !== criteria.category) {
      return false;
    }
    
    // Date filter
    if (criteria.date && event.date !== criteria.date) {
      return false;
    }
    
    // Price filter
    if (criteria.price) {
      if (criteria.price === 'free' && event.price !== 0) return false;
      if (criteria.price === 'budget' && event.price > 500) return false;
      if (criteria.price === 'standard' && (event.price <= 500 || event.price > 1000)) return false;
      if (criteria.price === 'premium' && event.price <= 1000) return false;
    }
    
    return true;
  });
  
  renderEventsGrid();
}

// Render events grid
function renderEventsGrid() {
  const eventsGrid = document.getElementById('eventsGrid');
  const noResults = document.getElementById('noResults');
  
  if (!eventsGrid) return;
  
  if (filteredEvents.length === 0) {
    eventsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  eventsGrid.innerHTML = filteredEvents.map(event => `
    <article class="event-card" onclick="showEventDetails(${event.id})" tabindex="0" role="button">
      <figure class="event-image">
        ${event.image ? `<img src="${event.image}" alt="${event.name}">` : ''}
      </figure>
      <section class="event-content">
        <span class="event-category">${event.category.toUpperCase()}</span>
        <h3 class="event-title">${event.name}</h3>
        <section class="event-details">
          <p> ${formatDate(event.date)} at ${formatTime(event.time)}</p>
          <p> ${event.venue}, ${event.city}</p>
          <p> ${event.attendees}/${event.capacity} attendees</p>
        </section>
        <div class="event-price ${event.price === 0 ? 'free' : ''}">
          ${event.price === 0 ? 'FREE' : 'R' + event.price.toFixed(2)}
        </div>
        <button class="event-button" type="button">View Details</button>
      </section>
    </article>
  `).join('');
}

// Show event details modal
function showEventDetails(eventId) {
  const event = eventDatabase.find(e => e.id === eventId);
  if (!event) return;
  
  const modal = document.getElementById('eventModal');
  const modalContent = document.getElementById('modalEventDetails');
  
  if (!modal || !modalContent) return;
  
  const availableSpots = event.capacity - event.attendees;
  
  modalContent.innerHTML = `
    <h2>${event.name}</h2>
    <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
      <figure style="width: 100%; height: 250px; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; background: #f2f2f2;">
        ${event.image ? `<img src="${event.image}" alt="${event.name}" style="width:100%; height:100%; object-fit:cover;">` : ''}
      </figure>
      <section>
        <h3 style="color: var(--primary); margin-bottom: 1rem;">Event Information</h3>
        <p><strong>Category:</strong> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</p>
        <p><strong>Type:</strong> ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
        <p><strong>Time:</strong> ${formatTime(event.time)}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Location:</strong> ${event.address}, ${event.city}</p>
        <p><strong>Price:</strong> ${event.price === 0 ? 'FREE' : 'R' + event.price.toFixed(2)}</p>
        <p><strong>Attendees:</strong> ${event.attendees}/${event.capacity}</p>
        <p><strong>Available Spots:</strong> ${availableSpots}</p>
      </section>
    </section>
    
    <section>
      <h3 style="color: var(--primary); margin: 2rem 0 1rem;">Description</h3>
      <p>${event.description}</p>
    </section>
    
    <section>
      <h3 style="color: var(--primary); margin: 2rem 0 1rem;">Organizer Information</h3>
      <p><strong>Organizer:</strong> ${event.organizer}</p>
      <p><strong>Email:</strong> <a href="mailto:${event.contactEmail}">${event.contactEmail}</a></p>
      ${event.phone ? `<p><strong>Phone:</strong> ${event.phone}</p>` : ''}
    </section>
    
    <footer style="display: flex; gap: 1rem; margin-top: 2rem;">
      <button class="btn btn-primary" type="button" onclick="registerForEventAndShow(${event.id})" ${availableSpots === 0 ? 'disabled' : ''}>
        ${availableSpots === 0 ? 'Event Full' : 'Register for Event'}
      </button>
      <button class="btn btn-secondary" type="button" onclick="closeEventModal()">Close</button>
    </footer>
  `;
  
  modal.classList.remove('hidden');
}

// Register for event from modal
function registerForEventAndShow(eventId) {
  if (registerForEvent(eventId)) {
    showSuccessMessage('Successfully registered for the event!');
    closeEventModal();
    renderEventsGrid();
  } else {
    showErrorMessage('Could not register for this event');
  }
}
