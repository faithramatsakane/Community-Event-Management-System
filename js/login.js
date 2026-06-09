// ===== LOGIN.JS =====
// Handle authentication and user registration

let googleClientId = '387286970232-or2mfsk2sbv2s7ssg61bcikmk6ehqv98.apps.googleusercontent.com';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginFormElement');
  const signupForm = document.getElementById('signupFormElement');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Initialize Google Sign-In
  initializeGoogleSignIn();
});

// Initialize Google Sign-In
function initializeGoogleSignIn() {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleSignIn,
      ux_mode: 'popup'
    });

    // Render Google Sign-In button
    const googleButton = document.getElementById('googleSignInButton');
    if (googleButton) {
      window.google.accounts.id.renderButton(
        googleButton,
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with'
        }
      );
    }
  } else {
    console.warn('Google Sign-In library not loaded');
    // Create a fallback button
    renderFallbackGoogleButton();
  }
}

// Render fallback Google button if library not loaded
function renderFallbackGoogleButton() {
  const googleButton = document.getElementById('googleSignInButton');
  if (googleButton) {
    googleButton.innerHTML = `
      <button type="button" class="btn btn-google" onclick="handleSimulatedGoogleSignIn()">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" alt="Google" style="width: 20px; height: 20px; margin-right: 0.5rem;">
        Sign in with Google
      </button>
    `;
  }
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
  if (response.credential) {
    // Decode JWT (base64 decode without verification for demo)
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      
      // Create user object from Google token
      const googleUser = {
        id: generateId(),
        email: decodedToken.email,
        firstName: decodedToken.given_name || 'Google',
        lastName: decodedToken.family_name || 'User',
        picture: decodedToken.picture,
        role: 'attendee',
        loginMethod: 'google',
        googleToken: response.credential,
        createdAt: new Date().toISOString(),
        events: [],
        registeredEvents: [],
        isOnline: true
      };
      
      // Save user
      currentUser = googleUser;
      saveUserToStorage();
      
      // Add to user database if not exists
      if (!userDatabase.find(u => u.email === googleUser.email)) {
        userDatabase.push(googleUser);
      }
      
      showSuccessMessage(`Welcome, ${googleUser.firstName}!`);
      
      setTimeout(() => {
        window.location.href = 'events.html';
      }, 1500);
    } catch (error) {
      console.error('Error processing Google token:', error);
      showErrorMessage('Error processing Google sign-in');
    }
  }
}

// Simulated Google Sign-In (for fallback)
function handleSimulatedGoogleSignIn() {
  const googleUser = {
    id: generateId(),
    email: 'user@gmail.com',
    firstName: 'Google',
    lastName: 'User',
    picture: 'https://lh3.googleusercontent.com/a/default-user',
    role: 'attendee',
    loginMethod: 'google',
    createdAt: new Date().toISOString(),
    events: [],
    registeredEvents: [],
    isOnline: true
  };
  
  currentUser = googleUser;
  saveUserToStorage();
  
  if (!userDatabase.find(u => u.email === googleUser.email)) {
    userDatabase.push(googleUser);
  }
  
  showSuccessMessage(`Welcome, ${googleUser.firstName}!`);
  
  setTimeout(() => {
    window.location.href = 'events.html';
  }, 1500);
}

// Toggle between login and signup forms
function toggleAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (loginForm) {
    loginForm.classList.toggle('hidden');
  }
  if (signupForm) {
    signupForm.classList.toggle('hidden');
  }
  
  return false;
}

// Handle login submission
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Validation
  if (!email || !password) {
    showErrorMessage('Please fill in all fields');
    return;
  }
  
  if (!isValidEmail(email)) {
    showErrorMessage('Please enter a valid email address');
    return;
  }
  
  // For demo purposes, accept any valid email/password combination
  const newUser = {
    id: generateId(),
    email: email,
    firstName: email.split('@')[0],
    lastName: 'User',
    role: 'attendee',
    loginMethod: 'email',
    createdAt: new Date().toISOString(),
    events: [],
    registeredEvents: [],
    isOnline: true
  };
  
  currentUser = newUser;
  saveUserToStorage();
  
  showSuccessMessage('Login successful! Redirecting...');
  
  setTimeout(() => {
    window.location.href = 'events.html';
  }, 1500);
}

// Handle signup submission
function handleSignup(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('userRole').value;
  const termsCheckbox = document.querySelector('input[name="terms"]');
  
  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
    showErrorMessage('Please fill in all fields');
    return;
  }
  
  if (firstName.length < 2) {
    showErrorMessage('First name must be at least 2 characters');
    return;
  }
  
  if (lastName.length < 2) {
    showErrorMessage('Last name must be at least 2 characters');
    return;
  }
  
  if (!isValidEmail(email)) {
    showErrorMessage('Please enter a valid email address');
    return;
  }
  
  if (password.length < 8) {
    showErrorMessage('Password must be at least 8 characters');
    return;
  }
  
  if (password !== confirmPassword) {
    showErrorMessage('Passwords do not match');
    return;
  }
  
  if (!termsCheckbox || !termsCheckbox.checked) {
    showErrorMessage('Please agree to the Terms of Service');
    return;
  }
  
  // Create new user
  const newUser = {
    id: generateId(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    role: role,
    loginMethod: 'email',
    createdAt: new Date().toISOString(),
    events: [],
    registeredEvents: [],
    isOnline: true
  };
  
  userDatabase.push(newUser);
  currentUser = newUser;
  saveUserToStorage();
  
  showSuccessMessage('Account created successfully! Redirecting...');
  
  setTimeout(() => {
    window.location.href = 'events.html';
  }, 1500);
}

// Password strength indicator
function checkPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[!@#$%^&*]/)) strength++;
  
  return strength;
}
