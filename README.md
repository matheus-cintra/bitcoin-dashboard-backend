# Bitcoin Dashboard App

Incorporate many bitcoin charts of many sites which sell the crypto

## Authentication

- [ ] Create Server
- [ ] Add auth router
- [ ] Create user with POST /auth/signup
      _ [ ] validate required fields
      _ [ ] Check if username is unique
      _ [ ] hash password with bcrypt
      _ [ ] insert into db
- [ ] Create Landing Page \* [ ] Link to Sign Up Page
- [ ] Create Sign Up Page
      _ [ ] Form with: username and password
      _ [ ] When form is submitted
      _ [ ] Validate username
      _ [ ] Display errors
      _ [ ] Validate password
      _ [ ] Display errors
      _ [ ] POST request to server
      _ [ ] Display errors
      _ [ ] If succesful sign up
      _ [ ] Redirect to login page
- [ ] Login user with POST /auth/login
      _ [ ] validate the user
      _ [ ] check if username in db
      _ [ ] compare password with hashed password in db
      _ [ ] Create and sign a JWT \* [ ] Respond with JWT
- [ ] Create Login Page
      _ [ ] Form with: username and password
      _ [ ] When form is submitted
      _ [ ] Validate username
      _ [ ] Display errors
      _ [ ] Validate password
      _ [ ] Display errors
      _ [ ] POST request to server /auth/login
      _ [ ] Display errors
      _ [ ] If succesful login
      _ [ ] Store the token in localStorage \* [ ] Redirect to the "dashboard"
- [ ] If a logged in user visits the signup or login page, redirect them to the dashboard
- [ ] If a non logged in user visits the dashboard, redirect to the login page
- [ ] After sign up, immediately login
- [ ] Show username on dashboard
- [ ] On homepage, show go to dashboard button instead of signup/login button
- [ ] If logged in:
      _ [ ] Show logout button in header
      _ [ ] Show user icon and username in header

### Authorization:

- [ ] Visitors can only see the homepage
      _ [ ] checkTokenSetUser middleware
      _ [ ] get token from Authorization header
      _ [ ] if defined ---
      _ [ ] Verify the token with the token secret
      _ [ ] Set req.user to be the decoded verified payload
      _ [ ] else - move along
      _ [ ] isLoggedIn middleware
      _ [ ] if req.user is set - move along
      _ [ ] else - send an unauthorized error message
      _ [ ] redirect to login form
- [ ] Logged in users can only see their page
- [ ] Create notes form on client
      _ [ ] Title
      _ [ ] Description
- [ ] POST /api/v1/notes
      _ [ ] Must be logged in
      _ [ ] Logged in Users Can Create Notes
      _ [ ] Title
      _ [ ] Description -- markdown \* [ ] Set user_id on server with logged in users id
- [ ] GET /api/v1/notes
      _ [ ] Must be logged in
      _ [ ] Logged in Users Can request all their notes \* [ ] Get all notes in DB with logged in users user_id
- [ ] List all notes on client \* [ ] Render description with Markdown

## STRETCH

- [ ] Store date of note in DB \* [ ] Sort notes by date created.
- [ ] View user profile
- [ ] Users can mark notes as public \* [ ] Notes show up on profile

## Admin Page:

- [ ] Admin page that lists all users
      _ [ ] admin table with user_id
      _ [ ] de-activate users
- [ ] Admin can see any page on site
- [ ] Rate limiting
  - [ ] Prevent brute force logins \* [ ] Lock out account after too many login attempts
- [ ] Password strength meter!
- [ ] reCaptcha for signup/login
- [ ] Password reset with email
- [ ] Forgot password
      _ [ ] Reset with email
      _ [ ] Reset by answering security questions
- [ ] Testing...

## To deploy everything to the same heroku instance

- [ ] Move the server package.json to the root of the folder
- [ ] Update start script for server to be a relative path
- [ ] post-deploy script to server that will build Vue.js
- [ ] Add a static serve to the server that serves '../client/dist'
- [ ] Environment variable for DB connection and token secret
- [ ] Update calls in client from localhost:5000 to be your-app.herokuapp.com
