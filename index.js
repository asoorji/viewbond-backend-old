const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connection URL for MongoDB Atlas
const uri = 'mongodb+srv://vb:XeRcr97uQbzfjrfS@cluster0.o1uhc7z.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define a user schema using Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register a new user
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({ username, email, password });

  newUser.save()
    .then(() => {
      res.status(200).send('User registered successfully');
    })
    .catch((error) => {
      res.status(500).send('Error registering new user');
    });
});

// User login
app.post('/api/login', (req, res) => {
  const { email } = req.body;

  // Find the user based on the provided email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // User not found
        return res.status(404).json({ error: 'User not found' });
      }

      // Successful login
      res.status(200).json({ message: 'Login successful', user });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error logging in' });
    });
});


// Get registered users
app.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving users');
    });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
