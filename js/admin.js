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
loadPeople();
loadEvents();
loadPayments();

setupPeopleFilters();

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
async function loadDashboard() {
  const result = await API.dashboard.getStats();
  
  if (result.success) {
    const stats = result.data;
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('activeEvents').textContent = stats.activeEvents || 0;
    document.getElementById('totalRevenue').textContent = 'R' + (stats.totalRevenue || 0).toLocaleString('en-ZA');
    document.getElementById('totalOrganizers').textContent = stats.totalOrganizers || 0;
  } else {
    // Fallback to local data if API fails
    const totalUsers = userDatabase.length;
    const activeEvents = eventDatabase.filter(e => new Date(e.date) >= new Date()).length;
    const totalRevenue = eventDatabase.reduce((sum, event) => sum + (event.attendees * event.price), 0);
    const totalOrganizers = userDatabase.filter(user => user.role === 'organizer').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeEvents').textContent = activeEvents;
    document.getElementById('totalRevenue').textContent = 'R' + totalRevenue.toLocaleString('en-ZA');
    document.getElementById('totalOrganizers').textContent = totalOrganizers;
    
    console.error('Dashboard stats API error:', result.error);
  }
}

// Load people in admin table
function loadPeople() {
    const peopleTableBody =
        document.getElementById('peopleTableBody');

    if (!peopleTableBody) return;

    if (userDatabase.length === 0) {

        peopleTableBody.innerHTML =
            '<tr><td colspan="7" class="text-center">No users found</td></tr>';

        return;
    }

    peopleTableBody.innerHTML =
        userDatabase.map(user => {

            const eventsCreated =
                eventDatabase.filter(
                    event => event.organizerId === user.id
                ).length;

            return `
                <tr>
                    <td>USR${String(user.id).padStart(5, '0')}</td>

                    <td>
                        ${user.firstName || ''} ${user.lastName || ''}
                    </td>

                    <td>${user.email}</td>

                    <td>${user.role}</td>

                    <td>${eventsCreated}</td>

                    <td>
                        <span style="
                            background:#27AE60;
                            color:white;
                            padding:0.25rem 0.5rem;
                            border-radius:4px;">
                            Active
                        </span>
                    </td>

                    <td>
                        <button
                            class="btn btn-small btn-secondary"
                            onclick="viewUserDetails(${user.id})">
                            View
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
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



// View payment details
function viewPaymentDetails(paymentId) {
  alert(`
Payment Details:
Transaction ID: TXN${String(paymentId).padStart(7, '0')}
Status: Completed
Amount: R50.00
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

function setupPeopleFilters() {

    const searchInput =
        document.getElementById('peopleSearch');

    const roleFilter =
        document.getElementById('roleFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterPeople);
    }

    if (roleFilter) {
        roleFilter.addEventListener('change', filterPeople);
    }
}

function filterPeople() {

    const searchTerm =
        document.getElementById('peopleSearch')
        .value
        .toLowerCase();

    const selectedRole =
        document.getElementById('roleFilter')
        .value;

    const filteredUsers = userDatabase.filter(user => {

        const fullName =
            `${user.firstName || ''} ${user.lastName || ''}`
            .toLowerCase();

        const matchesSearch =
            fullName.includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);

        const matchesRole =
            selectedRole === '' ||
            user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    console.log(filteredUsers);
}