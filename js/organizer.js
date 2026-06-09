// ===== ORGANIZER.JS =====
// Handle event creation and organization features

document.addEventListener('DOMContentLoaded', function() {
  const createEventForm = document.getElementById('createEventForm');
  
  if (createEventForm) {
    createEventForm.addEventListener('submit', handleCreateEvent);
  }
  
  // Setup tab switching
  setupTabSwitching();
  
  // Load organizer's events
  loadMyEvents();
  
  // Load analytics
  loadAnalytics();
  
  // Handle free event checkbox
  const isFreeCheckbox = document.getElementById('isFreeEvent');
  if (isFreeCheckbox) {
    isFreeCheckbox.addEventListener('change', function() {
      const priceInput = document.getElementById('eventPrice');
      if (this.checked) {
        priceInput.value = '0';
        priceInput.disabled = true;
      } else {
        priceInput.disabled = false;
        priceInput.value = '';
      }
    });
  }
});

// Setup tab switching
function setupTabSwitching() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show selected tab content
      const tabId = this.getAttribute('data-tab');
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
        selectedTab.classList.add('active');
      }
    });
  });
}

// Handle create event form submission
function handleCreateEvent(e) {
  e.preventDefault();
  
  // Check if user is logged in
  if (!currentUser) {
    showErrorMessage('Please login to create an event');
    window.location.href = 'login.html';
    return;
  }
  
  // Get form values
  const eventName = document.getElementById('eventName').value.trim();
  const description = document.getElementById('eventDescription').value.trim();
  const category = document.getElementById('eventCategory').value;
  const type = document.getElementById('eventType').value;
  const startDateTime = document.getElementById('eventStart').value;
  const endDateTime = document.getElementById('eventEnd').value;
  const venue = document.getElementById('eventVenue').value.trim();
  const city = document.getElementById('eventCity').value.trim();
  const address = document.getElementById('eventAddress').value.trim();
  const postalCode = document.getElementById('eventPostalCode').value.trim();
  const price = parseFloat(document.getElementById('eventPrice').value);
  const capacity = parseInt(document.getElementById('eventCapacity').value);
  const imageUrl = document.getElementById('eventImage').value.trim();
  const organizer = document.getElementById('eventOrganizer').value.trim();
  const contactEmail = document.getElementById('eventContact').value.trim();
  const phone = document.getElementById('eventPhone').value.trim();
  
  // Validation
  if (!eventName || !description || !category || !type) {
    showErrorMessage('Please fill in all required event details');
    return;
  }
  
  if (!startDateTime || !endDateTime) {
    showErrorMessage('Please provide start and end date/time');
    return;
  }
  
  if (new Date(startDateTime) >= new Date(endDateTime)) {
    showErrorMessage('End date must be after start date');
    return;
  }
  
  if (!venue || !city || !address) {
    showErrorMessage('Please provide venue information');
    return;
  }
  
  if (isNaN(price) || price < 0) {
    showErrorMessage('Please enter a valid price');
    return;
  }
  
  if (isNaN(capacity) || capacity < 1) {
    showErrorMessage('Please enter a valid capacity');
    return;
  }
  
  if (!isValidEmail(contactEmail)) {
    showErrorMessage('Please enter a valid contact email');
    return;
  }
  
  // Parse date and time
  const startDate = new Date(startDateTime).toISOString().split('T')[0];
  const startTime = startDateTime.split('T')[1].substring(0, 5);
  
  // Create event object
  const newEvent = {
    id: generateId(),
    name: eventName,
    description: description,
    category: category,
    type: type,
    date: startDate,
    time: startTime,
    venue: venue,
    city: city,
    address: address,
    postalCode: postalCode,
    price: price,
    capacity: capacity,
    attendees: 0,
    organizer: organizer,
    contactEmail: contactEmail,
    phone: phone,
    imageUrl: imageUrl,
    image: '📅',
    createdAt: new Date().toISOString(),
    organizerId: currentUser.id,
    ratings: []
  };
  
  // Add to event database
  eventDatabase.push(newEvent);
  
  // Add to user's events
  if (!currentUser.events) {
    currentUser.events = [];
  }
  currentUser.events.push(newEvent.id);
  saveUserToStorage();
  
  // Show success message
  showSuccessMessage('Event created successfully!');
  
  // Reset form
  e.target.reset();
  
  // Refresh my events list
  loadMyEvents();
  
  // Switch to my events tab
  switchTab('my-events');
}

// Load user's created events
function loadMyEvents() {
  const myEventsGrid = document.getElementById('myEventsGrid');
  if (!myEventsGrid) return;
  
  if (!currentUser || !currentUser.events || currentUser.events.length === 0) {
    myEventsGrid.innerHTML = '<p>You haven\'t created any events yet. <a href="#create-event" onclick="switchTab(\'create-event\')">Create your first event</a></p>';
    return;
  }
  
  const userEvents = eventDatabase.filter(event => currentUser.events.includes(event.id));
  
  if (userEvents.length === 0) {
    myEventsGrid.innerHTML = '<p>You haven\'t created any events yet.</p>';
    return;
  }
  
  myEventsGrid.innerHTML = userEvents.map(event => `
    <div class="my-event-card">
      <h3>${event.name}</h3>
      <div class="event-meta">
        <p>📅 ${formatDate(event.date)} at ${formatTime(event.time)}</p>
        <p>📍 ${event.venue}, ${event.city}</p>
        <p>👥 ${event.attendees}/${event.capacity} Attendees</p>
        <p>💰 ${event.price === 0 ? 'FREE' : 'R' + event.price.toFixed(2)}</p>
      </div>
      <div class="my-event-actions">
        <button class="btn btn-small edit-btn" onclick="editEvent(${event.id})">Edit</button>
        <button class="btn btn-small delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Edit event
function editEvent(eventId) {
  showSuccessMessage('Edit feature coming soon!');
}

// Delete event
function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this event?')) {
    eventDatabase = eventDatabase.filter(e => e.id !== eventId);
    currentUser.events = currentUser.events.filter(id => id !== eventId);
    saveUserToStorage();
    showSuccessMessage('Event deleted successfully');
    loadMyEvents();
  }
}

// Load analytics
function loadAnalytics() {
  const analyticsContainer = document.getElementById('analyticsContainer');
  if (!analyticsContainer) return;
  
  if (!currentUser || !currentUser.events || currentUser.events.length === 0) {
    analyticsContainer.innerHTML = '<p>No events created yet. Analytics will appear here once you create your first event.</p>';
    return;
  }
  
  const userEvents = eventDatabase.filter(event => currentUser.events.includes(event.id));
  
  const totalAttendees = userEvents.reduce((sum, event) => sum + event.attendees, 0);
  const totalCapacity = userEvents.reduce((sum, event) => sum + event.capacity, 0);
  const totalRevenue = userEvents.reduce((sum, event) => sum + (event.attendees * event.price), 0);
  const averageAttendanceRate = totalCapacity > 0 ? ((totalAttendees / totalCapacity) * 100).toFixed(1) : 0;
  
  analyticsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Events</h3>
        <p class="stat-number">${userEvents.length}</p>
      </div>
      <div class="stat-card">
        <h3>Total Attendees</h3>
        <p class="stat-number">${totalAttendees}</p>
      </div>
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="stat-number">R${totalRevenue.toFixed(2)}</p>
      </div>
      <div class="stat-card">
        <h3>Avg. Attendance Rate</h3>
        <p class="stat-number">${averageAttendanceRate}%</p>
      </div>
    </div>
    
    <h3 style="margin-top: 2rem; color: #4A90E2;">Event Summary</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Date</th>
          <th>Attendees</th>
          <th>Revenue</th>
          <th>Fill Rate</th>
        </tr>
      </thead>
      <tbody>
        ${userEvents.map(event => `
          <tr>
            <td>${event.name}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.attendees}/${event.capacity}</td>
            <td>$${(event.attendees * event.price).toFixed(2)}</td>
            <td>${((event.attendees / event.capacity) * 100).toFixed(1)}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
