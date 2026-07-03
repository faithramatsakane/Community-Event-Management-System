// ===== EVENTS.JS =====
// Handle events listing, filtering, and event details

let filteredEvents = [];

document.addEventListener('DOMContentLoaded', function() {
  loadAndDisplayEvents();
  setupEventFilters();
});

// Load events from backend and display
async function loadAndDisplayEvents() {
  showLoadingMessage('Loading events...');
  
  console.log('🔄 Fetching events from backend...');
  const result = await API.events.getAll();
  
  console.log('📊 API Result:', result);
  console.log('📊 Events Data:', result.data);
  
  if (result.success) {
    console.log('✅ Events loaded successfully. Count:', result.data.length);
    eventDatabase = result.data;
    displayAllEvents();
    hideLoadingMessage();
  } else {
    console.error('❌ Events API error:', result.error);
    showErrorMessage('Failed to load events. Using cached data.');
    console.log('📊 Using local eventDatabase. Count:', eventDatabase.length);
    displayAllEvents();
  }
}

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
    // Search filter (handle both 'name' and 'title' fields)
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      const eventName = event.name || event.title || '';
      const eventDesc = event.description || '';
      if (!eventName.toLowerCase().includes(searchLower) &&
          !eventDesc.toLowerCase().includes(searchLower)) {
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
  
  eventsGrid.innerHTML = filteredEvents.map(event => {
    // Handle both frontend and backend field names
    const eventName = event.name || event.title || 'Unnamed Event';
    const eventCategory = event.category || 'general';
    const eventDate = event.date || '';
    const eventImage = event.image || '';
    const eventPrice = event.price || 0;
    const eventCapacity = event.capacity || 100;
    const eventAttendees = event.attendees || 0;
    const eventVenue = event.venue || event.location || 'TBA';
    const eventCity = event.city || '';
    const eventTime = event.time || '';
    
    return `
      <article class="event-card" onclick="showEventDetails(${event.id})" tabindex="0" role="button">
        <figure class="event-image">
          ${eventImage ? `<img src="${eventImage}" alt="${eventName}">` : ''}
        </figure>
        <section class="event-content">
          <span class="event-category">${eventCategory.toUpperCase()}</span>
          <h3 class="event-title">${eventName}</h3>
          <section class="event-details">
            <p> ${formatDate(eventDate)} ${eventTime ? `at ${formatTime(eventTime)}` : ''}</p>
            <p> ${eventVenue}${eventCity ? `, ${eventCity}` : ''}</p>
            <p> ${eventAttendees}/${eventCapacity} attendees</p>
          </section>
          <div class="event-price ${eventPrice === 0 ? 'free' : ''}">
            ${eventPrice === 0 ? 'FREE' : 'R' + eventPrice.toFixed(2)}
          </div>
          <button class="event-button" type="button">View Details</button>
        </section>
      </article>
    `;
  }).join('');
}

// Show event details modal
function showEventDetails(eventId) {
  const event = eventDatabase.find(e => e.id === eventId);
  if (!event) return;
  
  const modal = document.getElementById('eventModal');
  const modalContent = document.getElementById('modalEventDetails');
  
  if (!modal || !modalContent) return;
  
  // Handle both frontend and backend field names
  const eventName = event.name || event.title || 'Unnamed Event';
  const eventDescription = event.description || '';
  const eventCategory = event.category || 'general';
  const eventType = event.type || 'community';
  const eventDate = event.date || '';
  const eventTime = event.time || '';
  const eventVenue = event.venue || event.location || 'TBA';
  const eventAddress = event.address || '';
  const eventCity = event.city || '';
  const eventPrice = event.price || 0;
  const eventCapacity = event.capacity || 100;
  const eventAttendees = event.attendees || 0;
  const eventOrganizer = event.organizer || 'Community Team';
  const eventEmail = event.contactEmail || '';
  const eventPhone = event.phone || '';
  const eventImage = event.image || '';
  
  const availableSpots = eventCapacity - eventAttendees;
  
  modalContent.innerHTML = `
    <h2>${eventName}</h2>
    <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
      <figure style="width: 100%; height: 250px; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; background: #f2f2f2;">
        ${eventImage ? `<img src="${eventImage}" alt="${eventName}" style="width:100%; height:100%; object-fit:cover;">` : ''}
      </figure>
      <section>
        <h3 style="color: var(--primary); margin-bottom: 1rem;">Event Information</h3>
        <p><strong>Category:</strong> ${eventCategory.charAt(0).toUpperCase() + eventCategory.slice(1)}</p>
        <p><strong>Type:</strong> ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</p>
        <p><strong>Date:</strong> ${formatDate(eventDate)}</p>
        ${eventTime ? `<p><strong>Time:</strong> ${formatTime(eventTime)}</p>` : ''}
        <p><strong>Venue:</strong> ${eventVenue}</p>
        <p><strong>Location:</strong> ${eventAddress}${eventCity ? `, ${eventCity}` : ''}</p>
        <p><strong>Price:</strong> ${eventPrice === 0 ? 'FREE' : 'R' + eventPrice.toFixed(2)}</p>
        <p><strong>Attendees:</strong> ${eventAttendees}/${eventCapacity}</p>
        <p><strong>Available Spots:</strong> ${availableSpots}</p>
      </section>
    </section>
    
    <section>
      <h3 style="color: var(--primary); margin: 2rem 0 1rem;">Description</h3>
      <p>${eventDescription}</p>
    </section>
    
    <section>
      <h3 style="color: var(--primary); margin: 2rem 0 1rem;">Organizer Information</h3>
      <p><strong>Organizer:</strong> ${eventOrganizer}</p>
      ${eventEmail ? `<p><strong>Email:</strong> <a href="mailto:${eventEmail}">${eventEmail}</a></p>` : ''}
      ${eventPhone ? `<p><strong>Phone:</strong> ${eventPhone}</p>` : ''}
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
