require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });
  app.use(express.static('public'));
// Middleware
app.use(express.json());

const allowedOrigins = ['http://127.0.0.1:5500', 'http://127.0.0.1:5502'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UserData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema with profile data
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    profile: {
        age: Number,
        dob: String,
        gender: String,
        phone: String,
        avatar: String
    },
    submissions: [{
        name: String,
        email: String,
        number: String,
        country: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Signup Route
app.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            profile: {} // Initialize empty profile
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            message: "Signup successful",
            token,
            user: {
                username,
                email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get profile data
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        res.status(200).json({
            username: req.user.username,
            email: req.user.email,
            profile: req.user.profile || {}
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/api/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      // Save avatar URL to user profile
      req.user.profile = req.user.profile || {};
      req.user.profile.avatar = avatarUrl;
      await req.user.save();
  
      res.status(200).json({ 
        message: "Avatar uploaded successfully",
        avatarUrl: avatarUrl
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
// Update profile data
app.post('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { age, dob, gender, phone } = req.body;
        
        req.user.profile = {
            age: age || req.user.profile?.age,
            dob: dob || req.user.profile?.dob,
            gender: gender || req.user.profile?.gender,
            phone: phone || req.user.profile?.phone
        };
        
        await req.user.save();
        
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Handle preflight requests
app.options('*', cors());

// Add form submission route
app.post('/submit-form', authMiddleware, async (req, res) => {
    try {
        req.user.submissions.push(req.body);
        await req.user.save();
        res.status(200).json({ message: "Form submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});