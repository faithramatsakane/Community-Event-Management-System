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
    <div class="event-card" onclick="showEventDetails(${event.id})">
      <div class="event-image">${event.image || '📅'}</div>
      <div class="event-content">
        <span class="event-category">${event.category.toUpperCase()}</span>
        <h3 class="event-title">${event.name}</h3>
        <div class="event-details">
          <div>📅 ${formatDate(event.date)} at ${formatTime(event.time)}</div>
          <div>📍 ${event.venue}, ${event.city}</div>
          <div>👥 ${event.attendees}/${event.capacity} attendees</div>
        </div>
        <div class="event-price ${event.price === 0 ? 'free' : ''}">
          ${event.price === 0 ? 'FREE' : 'R' + event.price.toFixed(2)}
        </div>
        <button class="event-button">View Details</button>
      </div>
    </div>
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
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
      <div>
        <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #4A90E2, #A78BFA); display: flex; align-items: center; justify-content: center; font-size: 4rem; border-radius: 8px;">
          ${event.image || '📅'}
        </div>
      </div>
      <div>
        <h3 style="color: #4A90E2; margin-bottom: 1rem;">Event Information</h3>
        <p><strong>Category:</strong> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</p>
        <p><strong>Type:</strong> ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
        <p><strong>Time:</strong> ${formatTime(event.time)}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Location:</strong> ${event.address}, ${event.city}</p>
        <p><strong>Price:</strong> ${event.price === 0 ? 'FREE' : 'R' + event.price.toFixed(2)}</p>
        <p><strong>Attendees:</strong> ${event.attendees}/${event.capacity}</p>
        <p><strong>Available Spots:</strong> ${availableSpots}</p>
      </div>
    </div>
    
    <h3 style="color: #4A90E2; margin: 2rem 0 1rem;">Description</h3>
    <p>${event.description}</p>
    
    <h3 style="color: #4A90E2; margin: 2rem 0 1rem;">Organizer Information</h3>
    <p><strong>Organizer:</strong> ${event.organizer}</p>
    <p><strong>Email:</strong> <a href="mailto:${event.contactEmail}">${event.contactEmail}</a></p>
    ${event.phone ? `<p><strong>Phone:</strong> ${event.phone}</p>` : ''}
    
    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
      <button class="btn btn-primary" onclick="registerForEventAndShow(${event.id})" ${availableSpots === 0 ? 'disabled' : ''}>
        ${availableSpots === 0 ? 'Event Full' : 'Register for Event'}
      </button>
      <button class="btn btn-secondary" onclick="closeEventModal()">Close</button>
    </div>
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
