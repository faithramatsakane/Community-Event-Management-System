// ===== LOGIN.JS =====
// Handle authentication and user registration

let googleClientId = '206620813075-mgtomgi5fd5eh2iotqaepo3bjdfhq4gu.apps.googleusercontent.com';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginFormElement');
  const signupForm = document.getElementById('signupFormElement');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  initializeGoogleSignInWhenReady();

  // Keep only the real Google button visible while GIS loads.
  const googleButton = document.getElementById('googleSignInButton');
  if (googleButton) {
    googleButton.innerHTML = '';
  }
});

function initializeGoogleSignInWhenReady() {
  const maxWaitMs = 6000;
  const pollIntervalMs = 100;
  const start = Date.now();

  const poll = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGoogleSignIn();
      return;
    }

    if (Date.now() - start >= maxWaitMs) {
      console.warn('Google Sign-In library not loaded (timed out).');
      return;
    }

    setTimeout(poll, pollIntervalMs);
  };

  poll();
}

function initializeGoogleSignIn() {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) return;

  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleSignIn,
    ux_mode: 'popup', // popup mode avoids redirect_uri issues
    prompt: 'select_account'
  });

  const googleButton = document.getElementById('googleSignInButton');
  if (googleButton) {
    window.google.accounts.id.renderButton(
      googleButton,
      {
        theme: 'outline',
        size: 'large',
        width: 300, // numeric value only
        text: 'signin_with'
      }
    );
  }
}

function handleGoogleSignIn(response) {
  if (!response || !response.credential) return;

  try {
    // Decode JWT (demo-only, not secure for production)
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decodedToken = JSON.parse(jsonPayload);

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

    currentUser = googleUser;
    saveUserToStorage();

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

// Toggle between login and signup forms
function toggleAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) loginForm.classList.toggle('hidden');
  if (signupForm) signupForm.classList.toggle('hidden');

  return false;
}

// Handle login submission
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const selectedRole = document.getElementById('loginRole')?.value || 'attendee';

  if (!email || !password) {
    showErrorMessage('Please fill in all fields');
    return;
  }

  if (!isValidEmail(email)) {
    showErrorMessage('Please enter a valid email address');
    return;
  }

  // Show loading state
  showLoadingMessage('Logging in...');

  // Call backend API
  const result = await API.auth.login(email, password, selectedRole);

  if (result.success) {
    const userData = result.data.user;
    
    // Store user data in localStorage
    currentUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.name?.split(' ')[0] || 'User',
      lastName: userData.name?.split(' ')[1] || '',
      role: userData.role,
      loginMethod: 'email',
      createdAt: new Date().toISOString(),
      events: [],
      registeredEvents: [],
      isOnline: true
    };

    saveUserToStorage();
    showSuccessMessage('Login successful! Redirecting...');

    setTimeout(() => {
      window.location.href = 'events.html';
    }, 1500);
  } else {
    showErrorMessage(result.error || 'Login failed. Please check your credentials.');
  }
}

// Handle signup submission
async function handleSignup(e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('userRole').value;
  const termsCheckbox = document.querySelector('input[name="terms"]');

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

  // Show loading state
  showLoadingMessage('Creating account...');

  // Call backend API to register
  const result = await API.auth.register(firstName, lastName, email, password, role);

  if (result.success) {
    const userData = result.data;

    // Store user data in localStorage
    currentUser = {
      id: userData.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      loginMethod: 'email',
      createdAt: new Date().toISOString(),
      events: [],
      registeredEvents: [],
      isOnline: true
    };

    userDatabase.push(currentUser);
    saveUserToStorage();

    showSuccessMessage('Account created successfully! Redirecting...');

    setTimeout(() => {
      window.location.href = 'events.html';
    }, 1500);
  } else {
    showErrorMessage(result.error || 'Registration failed. Please try again.');
  }
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
