// ===== MAIN.JS =====
// Global utility functions and initialization

// Mock database (in a real app, this would be a backend)
let eventDatabase = [
  {
    id: 1,
    name: "Community Clean Up Drive",
    category: "social",
    type: "inperson",
    date: "2026-08-09",
    time: "09:00",
    venue: "Braamfontein Green Hub",
    city: "Johannesburg",
    address: "Braamfontein Main Entrance",
    price: 0,
    capacity: 100,
    attendees: 45,
    organizer: "Green Community",
    contactEmail: "green@community.com",
    image: "Images/cleanup.jpg",
    description: "Join us for a community clean up drive in Braamfontein. We'll be collecting trash and improving our local environment across Gauteng."
  },
  {
    id: 2,
    name: "Tech Workshop: Everything Code",
    category: "workshop",
    type: "hybrid",
    date: "2026-07-20",
    time: "08:00",
    venue: "Sandton Tech Hub",
    city: "Sandton",
    address: "Corner of Rivonia Road and West Street",
    price: 200.00,
    capacity: 50,
    attendees: 32,
    organizer: "Tech Academy",
    contactEmail: "contact@techacademy.com",
    image: "Images/code.jfif",
    description: "Learn the fundamentals of web development with hands-on practice at Sandton Tech Hub. Suitable for beginners to intermediate developers across Gauteng."
  },
  {
    id: 3,
    name: "Community Music Festival",
    category: "music",
    type: "inperson",
    date: "2026-08-01",
    time: "18:00",
    venue: "Emmarentia Amphitheatre",
    city: "Johannesburg",
    address: "Emmarentia Botanical Gardens",
    price: 250.00,
    capacity: 500,
    attendees: 250,
    organizer: "Cultural Events Inc",
    contactEmail: "events@cultural.com",
    image: "Images/music-festival.jpg",
    description: "Experience an evening of live music featuring local Gauteng artists and emerging talents from the community."
  },
  {
    id: 4,
    name: "Charity Sports Tournament",
    category: "sports",
    type: "inperson",
    date: "2026-07-19",
    time: "10:00",
    venue: "Ellis Park Sports Complex",
    city: "Johannesburg",
    address: "Main Stadium Road, Doornfontein",
    price: 250.00,
    capacity: 200,
    attendees: 120,
    organizer: "Local Sports Club",
    contactEmail: "sports@clublocal.com",
    image: "Images/sports.jpg",
    description: "Join our charity sports tournament in Johannesburg. All proceeds support local Gauteng youth programs."
  }
];

let userDatabase = [];
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadUserFromStorage();
  initializeEventListeners();
  updateNavbarWithUserInfo();
});

// Load user from localStorage
function loadUserFromStorage() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
}

// Save user to localStorage
function saveUserToStorage() {
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
}

// Initialize global event listeners
function initializeEventListeners() {
  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('eventModal');
    if (modal && event.target === modal) {
      closeEventModal();
    }
  });

  // Tab switching for organizer page
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.getAttribute('data-tab'));
    });
  });

  // Admin navigation
  const adminNavLinks = document.querySelectorAll('.admin-nav .nav-link');
  adminNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      switchAdminSection(this.getAttribute('data-section'));
    });
  });
}

// Update navbar with user information
function updateNavbarWithUserInfo() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Remove existing user profile if it exists
  const existingProfile = navLinks.querySelector('.user-profile');
  if (existingProfile) {
    existingProfile.remove();
  }

  if (currentUser) {
    // User is logged in
    const userHTML = `
      <li class="user-profile">
        <div class="user-info-container">
          <div class="user-avatar" title="${currentUser.firstName} ${currentUser.lastName}">
            ${currentUser.picture ? 
              `<img src="${currentUser.picture}" alt="User" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
              `<span>${currentUser.firstName.charAt(0).toUpperCase()}${currentUser.lastName ? currentUser.lastName.charAt(0).toUpperCase() : ''}</span>`
            }
          </div>
          <div class="user-dropdown">
            <button class="user-name" onclick="toggleUserDropdown(event)">
              ${currentUser.firstName} ${currentUser.lastName}
              <span style="font-size: 0.8rem;">▼</span>
            </button>
            <div class="dropdown-menu hidden" id="userDropdownMenu">
              <div class="online-indicator"> Online</div>
              <a href="#" onclick="viewProfile(event)"> My Profile</a>
              <a href="#" onclick="viewMyRegistrations(event)"> My Events</a>
              ${currentUser.role === 'organizer' ? 
                `<a href="organizer.html"> Organize Events</a>` :
                `<a href="#" onclick="switchToOrganizer(event)"> Become an Organizer</a>`
              }
              ${currentUser.role === 'admin' ? 
                `<a href="admin.html"> Admin Panel</a>` :
                ``
              }
              <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #ddd;">
              <a href="#" onclick="logoutUser(event)" class="logout-link"> Logout</a>
            </div>
          </div>
        </div>
      </li>
    `;
    navLinks.innerHTML = navLinks.innerHTML + userHTML;
  }
}

// Toggle user dropdown
function toggleUserDropdown(e) {
  e.preventDefault();
  const dropdown = document.getElementById('userDropdownMenu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const userProfile = document.querySelector('.user-profile');
  const dropdown = document.getElementById('userDropdownMenu');
  if (userProfile && !userProfile.contains(e.target) && dropdown) {
    dropdown.classList.add('hidden');
  }
});

// View user profile
function viewProfile(e) {
  e.preventDefault();
  if (!currentUser) return;
  
  const profileInfo = `
User Profile Information:

Name: ${currentUser.firstName} ${currentUser.lastName}
Email: ${currentUser.email}
Role: ${currentUser.role}
Login Method: ${currentUser.loginMethod || 'Email'}
Member Since: ${formatDate(currentUser.createdAt)}
Status: 🟢 Online

Events Created: ${currentUser.events ? currentUser.events.length : 0}
Events Registered: ${currentUser.registeredEvents ? currentUser.registeredEvents.length : 0}
  `;
  
  alert(profileInfo);
  toggleUserDropdown({preventDefault: () => {}});
}

// View user registrations
function viewMyRegistrations(e) {
  e.preventDefault();
  if (!currentUser) return;
  
  const myEvents = eventDatabase.filter(event => 
    currentUser.registeredEvents && currentUser.registeredEvents.includes(event.id)
  );
  
  if (myEvents.length === 0) {
    alert('You are not registered for any events yet.');
  } else {
    let eventsList = 'My Registered Events:\n\n';
    myEvents.forEach(event => {
      eventsList += `${event.name}\n📅 ${formatDate(event.date)}\n📍 ${event.venue}\n\n`;
    });
    alert(eventsList);
  }
  
  toggleUserDropdown({preventDefault: () => {}});
}

// Switch to organizer
function switchToOrganizer(e) {
  e.preventDefault();
  if (!currentUser) return;
  
  currentUser.role = 'organizer';
  saveUserToStorage();
  showSuccessMessage('You are now an organizer!');
  window.location.href = 'organizer.html';
}

// Logout user
function logoutUser(e) {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSuccessMessage('Logged out successfully!');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Utility function to switch tabs
function switchTab(tabId) {
  // Hide all tabs
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  // Remove active class from all buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to clicked button
  event.target.classList.add('active');
}

// Utility function to switch admin sections
function switchAdminSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(section => section.classList.remove('active'));

  // Remove active class from all nav links
  const navLinks = document.querySelectorAll('.admin-nav .nav-link');
  navLinks.forEach(link => link.classList.remove('active'));

  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }

  // Add active class to clicked link
  event.target.classList.add('active');
}

// Close event modal
function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Register user
function registerUser(userData) {
  const user = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString(),
    events: [],
    registeredEvents: []
  };
  
  userDatabase.push(user);
  currentUser = user;
  saveUserToStorage();
  
  return user;
}

// Login user
function loginUser(email, password) {
  // In a real app, this would validate against a backend
  const user = userDatabase.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    saveUserToStorage();
    return true;
  }
  
  return false;
}

// Logout user
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Generate unique ID
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Filter events
function filterEvents(criteria) {
  return eventDatabase.filter(event => {
    if (criteria.category && event.category !== criteria.category) return false;
    if (criteria.date && event.date !== criteria.date) return false;
    if (criteria.price !== undefined) {
      if (criteria.price === 'free' && event.price !== 0) return false;
      if (criteria.price === 'budget' && event.price > 500) return false;
      if (criteria.price === 'standard' && (event.price <= 500 || event.price > 1000)) return false;
      if (criteria.price === 'premium' && event.price <= 1000) return false;
    }
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      return event.name.toLowerCase().includes(searchLower) ||
             event.description.toLowerCase().includes(searchLower);
    }
    return true;
  });
}

// Create event
function createEvent(eventData) {
  const event = {
    id: generateId(),
    ...eventData,
    createdAt: new Date().toISOString(),
    organizerId: currentUser ? currentUser.id : null,
    attendees: 0,
    ratings: []
  };
  
  eventDatabase.push(event);
  
  if (currentUser) {
    currentUser.events.push(event.id);
    saveUserToStorage();
  }
  
  return event;
}

// Register for event
function registerForEvent(eventId) {
  if (!currentUser) {
    alert('Please login to register for this event');
    window.location.href = 'login.html';
    return false;
  }

  const event = eventDatabase.find(e => e.id === eventId);
  if (!event) return false;

  if (event.attendees >= event.capacity) {
    alert('This event is at full capacity');
    return false;
  }

  if (!currentUser.registeredEvents.includes(eventId)) {
    event.attendees++;
    currentUser.registeredEvents.push(eventId);
    saveUserToStorage();
    return true;
  }

  return false;
}

// Show success message
function showSuccessMessage(message) {
  const div = document.createElement('div');
  div.className = 'success-message';
  div.textContent = message;
  div.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #27AE60; color: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.3s ease;';
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Show error message
function showErrorMessage(message) {
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = message;
  div.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #E74C3C; color: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.3s ease;';
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Show loading message
function showLoadingMessage(message) {
  // Remove any existing loading message first
  const existing = document.getElementById('loadingMessage');
  if (existing) {
    existing.remove();
  }
  
  const div = document.createElement('div');
  div.id = 'loadingMessage';
  div.className = 'loading-message';
  div.textContent = message;
  div.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #3498DB; color: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.3s ease;';
  document.body.appendChild(div);
}

// Hide loading message
function hideLoadingMessage() {
  const div = document.getElementById('loadingMessage');
  if (div) {
    div.remove();
  }
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password
function isValidPassword(password) {
  // At least 8 characters, 1 number, 1 special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}
