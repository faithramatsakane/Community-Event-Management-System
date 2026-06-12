#  Community Event Management System (CEMS)

##  Overview
The **Community Event Management System (CEMS)** is a comprehensive web application designed to simplify the planning, organization, and execution of community events. It provides tools for event organizers, attendees, volunteers, and administrators to seamlessly interact, manage events, handle registrations, and track analytics.

---

##  🎯 Key Features

### 👥 User Management
- **User Registration & Authentication**: Create accounts as attendees, organizers, or volunteers
- **Role-Based Access**: Different features available based on user role
- **Profile Management**: Update personal information and preferences
- **Session Management**: Secure login/logout functionality

### 📅 Event Management
- **Event Creation**: Organizers can create events with detailed information
- **Event Browsing**: Attendees can search and filter events by category, date, price
- **Event Details**: Comprehensive event information including organizer contact
- **Event Editing**: Update event details (organizers only)
- **Event Deletion**: Remove events from the system

### 🎫 Ticketing & Registration
- **Online Registration**: Attendees can register for events
- **Price Management**: Support for free and paid events
- **Capacity Management**: Track event capacity and attendance limits
- **Registration Confirmation**: Users receive confirmation of their registration
- **Ticket Tracking**: View registered events in user dashboard

### 🔍 Search & Filtering
- **Advanced Search**: Search events by name or description
- **Category Filtering**: Filter events by type (sports, music, workshop, etc.)
- **Date Filtering**: Find events on specific dates
- **Price Range Filtering**: Filter events by price ranges
- **Dynamic Results**: Real-time filtering as criteria change

### 📊 Analytics & Reporting
- **Event Statistics**: View attendee counts, revenue, and fill rates
- **Organizer Dashboard**: Track your event performance
- **Admin Reports**: Generate comprehensive system reports
- **Revenue Tracking**: Monitor ticket sales and revenue
- **Attendance Analysis**: View attendance trends and percentages

### 🔐 Admin Dashboard
- **User Management**: View and manage all users
- **Event Management**: Monitor all events in the system
- **Organizer Management**: Verify and manage event organizers
- **Payment Tracking**: Monitor all transactions
- **System Reports**: Generate various reports (revenue, attendance, etc.)
- **Settings Management**: Configure platform settings

---

##  📋 Project Structure

```
Community-Event-Management-System/
├── index.html           # Landing page
├── login.html           # Authentication page
├── events.html          # Events listing and browsing
├── organizer.html       # Event creation and management
├── admin.html           # Admin dashboard
├── css/
│   └── style.css        # Comprehensive styling
├── js/
│   ├── main.js          # Global functions and utilities
│   ├── login.js         # Authentication logic
│   ├── events.js        # Events display and filtering
│   ├── organizer.js     # Event creation and organization
│   └── admin.js         # Admin dashboard functionality
└── README.md            # Documentation
```

---

##  🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/yourusername/Community-Event-Management-System.git
   cd Community-Event-Management-System
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for better performance:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

---

##  📖 Usage Guide

### For Attendees
1. **Browse Events**: Visit the Events page to see all available events
2. **Filter Events**: Use search and filter options to find events you're interested in
3. **View Details**: Click on an event to see full details
4. **Register**: Click "Register for Event" to attend (requires login)
5. **Track Registrations**: View your registered events in your profile

### For Event Organizers
1. **Create Account**: Sign up as an organizer
2. **Create Event**: Go to "Organize" section and fill in event details
   - Event name, description, category
   - Date, time, and location
   - Capacity and pricing
   - Contact information
3. **Manage Events**: View and edit your created events
4. **Analytics**: Track attendee numbers and revenue from your events
5. **Delete Events**: Remove events you no longer need

### For Administrators
1. **Access Admin Panel**: Go to admin.html (currently no password required in demo)
2. **Dashboard**: View key metrics and statistics
3. **Manage Users**: View all users and their information
4. **Manage Events**: Monitor all events, cancel if necessary
5. **Manage Organizers**: Verify and manage organizer accounts
6. **Payment Tracking**: Monitor all transactions
7. **Generate Reports**: Create custom reports for various metrics
8. **System Settings**: Configure platform-wide settings

---

##  🔐 Authentication

The application includes a demonstration authentication system:
- **Login**: Use any valid email and password to login
- **Signup**: Create new accounts with first name, last name, email, password, and role
- **Logout**: Securely log out and return to home page
- **Session Persistence**: User data is stored in browser's localStorage

⚠️ **Note**: In a production environment, implement proper backend authentication with encrypted passwords and secure session management.

---

##  💻 Technology Stack

### Frontend
- **HTML5**: Semantic markup and forms
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Interactive features and data management

### Data Storage
- **localStorage**: Client-side persistence for demo purposes
- **In-Memory Database**: Event and user data stored in JavaScript objects

### Browser APIs Used
- DOM Manipulation
- Local Storage API
- Date & Time APIs
- Form Handling

---

##  🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Flexible grid layouts
- Touch-friendly interfaces

### Color Scheme
- **Primary**: #4A90E2 (Blue)
- **Secondary**: #6DBE45 (Green)
- **Accent**: #A78BFA (Purple)
- **Light Background**: #FDFBF7 (Beige)

### UI Components
- Navigation bars
- Cards and grids
- Forms with validation
- Modals and dialogs
- Tables for data display
- Action buttons

---

##  📝 Event Categories

The system supports the following event categories:
- **Sports**: Athletic events and competitions
- **Music**: Concerts and musical performances
- **Workshop**: Educational and training sessions
- **Social**: Community gatherings and social events
- **Conference**: Professional conferences and seminars
- **Charity**: Fundraising and charitable events

---

##  🔧 Configuration

### Adding Mock Events
Edit `js/main.js` and add events to the `eventDatabase` array:
```javascript
{
  id: 5,
  name: "Your Event Name",
  category: "sports",
  type: "inperson",
  date: "2024-08-20",
  time: "15:00",
  venue: "Venue Name",
  city: "City Name",
  address: "Street Address",
  price: 25.00,
  capacity: 100,
  attendees: 0,
  organizer: "Your Name",
  contactEmail: "email@example.com",
  image: "📅",
  description: "Event description here"
}
```

---

##  🚧 Future Enhancements

### Phase 2
- [ ] Backend API integration
- [ ] Email notifications
- [ ] QR code ticket generation
- [ ] Payment gateway integration
- [ ] User reviews and ratings
- [ ] Social media sharing

### Phase 3
- [ ] Advanced analytics dashboard
- [ ] Volunteer management system
- [ ] Resource booking system
- [ ] Event promotion tools
- [ ] Mobile app
- [ ] Calendar integration

---

##  🐛 Known Limitations

1. **Data Persistence**: Uses localStorage (browser-specific, limited storage)
2. **No Backend**: All data is client-side and lost on browser clear
3. **Authentication**: Demo authentication without real password hashing
4. **No Real Payments**: Ticketing is simulated without payment processing
5. **Single User**: No real user accounts database

---

##  🔒 Security Considerations

### For Development
- This is a demo application without production-level security
- Passwords are stored in plain text in localStorage
- No input sanitization against XSS attacks
- No CSRF protection

### For Production
Implement the following:
- Secure backend server with proper authentication
- Password hashing (bcrypt, Argon2)
- HTTPS/SSL encryption
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Rate limiting
- Two-factor authentication

---

##  📞 Support & Contact

For issues, suggestions, or contributions:
- **Project Contributors**: Faith Ramatsakane, Rivoningo Ndlhovu, Thapelo Kgomo, Pulane Makhotla
- **Issues**: Please report bugs and request features through GitHub Issues
- **Email**: contact@cemsystem.com (demo)

---

##  📄 License

This project is provided as-is for educational and community purposes.

---

##  🎓 Learning Outcomes

By studying this project, you will learn:
- ✅ HTML5 semantic structure
- ✅ CSS3 modern layouts (Grid, Flexbox)
- ✅ JavaScript ES6+ features
- ✅ DOM manipulation and event handling
- ✅ Local storage and data persistence
- ✅ Form validation and error handling
- ✅ Responsive web design
- ✅ UI/UX best practices

---

##  📊 Statistics

- **Total HTML Files**: 5 pages
- **Lines of CSS**: 800+
- **Lines of JavaScript**: 1000+
- **Features Implemented**: 50+
- **User Roles**: 3 (Attendee, Organizer, Admin)
- **Event Categories**: 6 types

---

Last Updated: 2026
Community Event Management System v1.0
