// Static test data. Anything secret or environment-specific belongs in .env instead.

export const users = {
  lockedOut: 'locked_out_user',
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
};

export const customer = {
  firstName: 'Test',
  lastName: 'Customer',
  postalCode: '30301',
};

export const messages = {
  lockedOut: 'Sorry, this user has been locked out.',
  badCredentials: 'Username and password do not match any user in this service',
  loginRequired: "You can only access '/inventory.html' when you are logged in.",
  firstNameRequired: 'First Name is required',
  orderComplete: 'Thank you for your order!',
};

// restful-booker's documented demo admin account. It's public, so it lives here
// rather than in .env. A real client's API credentials always go in .env.
export const bookerAdmin = { username: 'admin', password: 'password123' };

export const sampleBooking = {
  firstname: 'Test',
  lastname: 'Guest',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
  additionalneeds: 'Late checkout',
};
