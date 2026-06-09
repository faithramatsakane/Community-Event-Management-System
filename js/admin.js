// ===== ADMIN.JS =====
// Handle admin dashboard and management features

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    // For demo purposes, allow admin access
    currentUser = { id: 999, role: 'admin', email: 'admin@cems.com' };
  }
  
  // Setup admin navigation
  setupAdminNavigation();
  
  // Load dashboard data
  loadDashboard();
  loadUsers();
  loadEvents();
  loadOrganizers();
  loadPayments();
});

// Setup admin navigation
function setupAdminNavigation() {
  const navLinks = document.querySelectorAll('.admin-nav .nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const sectionId = this.getAttribute('data-section');
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all sections
      const sections = document.querySelectorAll('.admin-section');
      sections.forEach(section => section.classList.remove('active'));
      
      // Show selected section
      const selectedSection = document.getElementById(sectionId);
      if (selectedSection) {
        selectedSection.classList.add('active');
      }
    });
  });
  
  // Set dashboard as active by default
  const dashboardLink = document.querySelector('[data-section="dashboard"]');
  if (dashboardLink) {
    dashboardLink.click();
  }
}

// Load dashboard
function loadDashboard() {
  const totalUsers = userDatabase.length + 1; // +1 for demo user
  const activeEvents = eventDatabase.filter(e => new Date(e.date) >= new Date()).length;
  const totalRevenue = eventDatabase.reduce((sum, event) => sum + (event.attendees * event.price), 0);
  const totalAttendees = eventDatabase.reduce((sum, event) => sum + event.attendees, 0);
  
  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('activeEvents').textContent = activeEvents;
  document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
  document.getElementById('totalAttendees').textContent = totalAttendees;
}

// Load users in admin table
function loadUsers() {
  const usersTableBody = document.getElementById('usersTableBody');
  if (!usersTableBody) return;
  
  const allUsers = [...userDatabase];
  if (allUsers.length === 0) {
    usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No users found</td></tr>';
    return;
  }
  
  usersTableBody.innerHTML = allUsers.map((user, index) => `
    <tr>
      <td>USR${String(user.id).padStart(5, '0')}</td>
      <td>${user.firstName || 'N/A'} ${user.lastName || ''}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${formatDate(user.createdAt)}</td>
      <td><span style="background: #27AE60; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">Active</span></td>
      <td><button class="btn btn-small btn-secondary" onclick="viewUserDetails(${user.id})">View</button></td>
    </tr>
  `).join('');
}

// Load events in admin table
function loadEvents() {
  const eventsTableBody = document.getElementById('eventsTableBody');
  if (!eventsTableBody) return;
  
  if (eventDatabase.length === 0) {
    eventsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No events found</td></tr>';
    return;
  }
  
  eventsTableBody.innerHTML = eventDatabase.map((event, index) => {
    const status = new Date(event.date) > new Date() ? 'Upcoming' : 'Completed';
    return `
      <tr>
        <td>EVT${String(event.id).padStart(5, '0')}</td>
        <td>${event.name}</td>
        <td>${event.organizer}</td>
        <td>${formatDate(event.date)}</td>
        <td>${event.attendees}</td>
        <td>R${(event.attendees * event.price).toFixed(2)}</td>
        <td><span style="background: ${status === 'Upcoming' ? '#3498DB' : '#95a5a6'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">${status}</span></td>
        <td><button class="btn btn-small btn-secondary" onclick="viewEventDetails(${event.id})">View</button></td>
      </tr>
    `;
  }).join('');
}

// Load organizers in admin table
function loadOrganizers() {
  const organizersTableBody = document.getElementById('organizersTableBody');
  if (!organizersTableBody) return;
  
  const organizers = userDatabase.filter(u => u.role === 'organizer');
  
  if (organizers.length === 0) {
    organizersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No organizers found</td></tr>';
    return;
  }
  
  organizersTableBody.innerHTML = organizers.map(org => {
    const eventCount = eventDatabase.filter(e => e.organizerId === org.id).length;
    return `
      <tr>
        <td>ORG${String(org.id).padStart(5, '0')}</td>
        <td>${org.firstName} ${org.lastName}</td>
        <td>${org.email}</td>
        <td>${eventCount}</td>
        <td><span style="background: #27AE60; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">Active</span></td>
        <td><span style="background: #F39C12; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">Verified</span></td>
        <td><button class="btn btn-small btn-secondary" onclick="manageOrganizer(${org.id})">Manage</button></td>
      </tr>
    `;
  }).join('');
}

// Load payments in admin table
function loadPayments() {
  const paymentsTableBody = document.getElementById('paymentsTableBody');
  if (!paymentsTableBody) return;
  
  const payments = [];
  eventDatabase.forEach(event => {
    for (let i = 0; i < event.attendees; i++) {
      payments.push({
        id: generateId(),
        eventId: event.id,
        eventName: event.name,
        amount: event.price,
        date: event.date,
        status: 'Completed',
        method: 'Credit Card'
      });
    }
  });
  
  if (payments.length === 0) {
    paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No payments found</td></tr>';
    return;
  }
  
  paymentsTableBody.innerHTML = payments.slice(0, 10).map(payment => `
    <tr>
      <td>TXN${String(payment.id).padStart(7, '0')}</td>
      <td>${payment.eventName}</td>
      <td>R${payment.amount.toFixed(2)}</td>
      <td>${formatDate(payment.date)}</td>
      <td><span style="background: #27AE60; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">${payment.status}</span></td>
      <td>${payment.method}</td>
      <td><button class="btn btn-small btn-secondary" onclick="viewPaymentDetails(${payment.id})">View</button></td>
    </tr>
  `).join('');
}

// Export users
function exportUsers() {
  let csv = 'ID,Name,Email,Role,Join Date\n';
  userDatabase.forEach(user => {
    csv += `${user.id},"${user.firstName} ${user.lastName}",${user.email},${user.role},${formatDate(user.createdAt)}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_export.csv';
  a.click();
  
  showSuccessMessage('Users exported successfully');
}

// View user details
function viewUserDetails(userId) {
  const user = userDatabase.find(u => u.id === userId);
  if (!user) return;
  
  alert(`
User Details:
ID: ${user.id}
Name: ${user.firstName} ${user.lastName}
Email: ${user.email}
Role: ${user.role}
Joined: ${formatDate(user.createdAt)}
Events Created: ${user.events ? user.events.length : 0}
Events Registered: ${user.registeredEvents ? user.registeredEvents.length : 0}
  `);
}

// View event details
function viewEventDetails(eventId) {
  const event = eventDatabase.find(e => e.id === eventId);
  if (!event) return;
  
  alert(`
Event Details:
ID: ${event.id}
Name: ${event.name}
Organizer: ${event.organizer}
Date: ${formatDate(event.date)}
Venue: ${event.venue}
Category: ${event.category}
Attendees: ${event.attendees}/${event.capacity}
Price: R${event.price.toFixed(2)}
Revenue: R${(event.attendees * event.price).toFixed(2)}
  `);
}

// Manage organizer
function manageOrganizer(organizerId) {
  const organizer = userDatabase.find(u => u.id === organizerId);
  if (!organizer) return;
  
  alert(`
Managing Organizer: ${organizer.firstName} ${organizer.lastName}
Email: ${organizer.email}
Status: Active
Verification: Verified

Actions available:
- Suspend account
- Deactivate
- Send message
  `);
}

// View payment details
function viewPaymentDetails(paymentId) {
  alert(`
Payment Details:
Transaction ID: TXN${String(paymentId).padStart(7, '0')}
Status: Completed
Amount: $50.00
Payment Method: Credit Card
Date: Today
  `);
}

// Generate report
function generateReport() {
  const reportType = document.getElementById('reportType').value;
  const reportMonth = document.getElementById('reportMonth').value;
  const reportContent = document.getElementById('reportContent');
  
  if (!reportType) {
    showErrorMessage('Please select a report type');
    return;
  }
  
  if (!reportMonth) {
    showErrorMessage('Please select a month');
    return;
  }
  
  let html = `<h3>Report Generated: ${new Date().toLocaleString()}</h3>`;
  html += `<p>Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}</p>`;
  html += `<p>Period: ${reportMonth}</p>`;
  
  if (reportType === 'revenue') {
    const revenue = eventDatabase.reduce((sum, event) => sum + (event.attendees * event.price), 0);
    html += `<p>Total Revenue: R${revenue.toFixed(2)}</p>`;
  } else if (reportType === 'attendance') {
    const totalAttendees = eventDatabase.reduce((sum, event) => sum + event.attendees, 0);
    html += `<p>Total Attendees: ${totalAttendees}</p>`;
  } else if (reportType === 'organizer') {
    html += `<p>Active Organizers: ${userDatabase.filter(u => u.role === 'organizer').length}</p>`;
  } else if (reportType === 'user') {
    html += `<p>Total Users: ${userDatabase.length}</p>`;
  }
  
  reportContent.innerHTML = html;
  showSuccessMessage('Report generated successfully');
}

// Approve organizer requests
function approveOrganizerRequest() {
  alert('Organizer requests will be shown here. All current organizers are approved.');
  showSuccessMessage('Organizer requests approved');
}
