const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ========== AI CHAT ENDPOINT using OpenRouter (FREE - Working Code) ==========
app.post('/api/chat/ai', async (req, res) => {
  console.log("Received request:", req.body);
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  try {
    // Messages ko OpenRouter ke format mein convert karo
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'agent' ? 'assistant' : msg.role,
      content: msg.content
    }));

    console.log("Calling OpenRouter API...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5001", // Aapki frontend ki URL
        "X-Title": "NexusAI Chat" // Aapke app ka naam
      },
      body: JSON.stringify({
        "model": "openrouter/free", // Free model (stable option)
        "messages": formattedMessages,
        "temperature": 0.7,
        "max_tokens": 500
      })
    });

    const data = await response.json();

    // Logging for debugging (production mein hata dena)
    console.log("OpenRouter Response Status:", response.status);
    console.log("OpenRouter Data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      // Agar request fail ho gayi, toh specific error details bhejo
      const errorMessage = data.error?.message || 'OpenRouter API call failed';
      console.error("OpenRouter API Error:", errorMessage);
      return res.status(response.status).json({ error: errorMessage });
    }

    // Response se reply extract karo
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });

  } catch (error) {
    console.error("Server error in AI endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========== MONGODB ATLAS CONNECTION ==========
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ========== SCHEMAS ==========
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'starter' },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  stats: {
    operations: { type: String, default: "2,847" },
    revenue: { type: String, default: "$48,291" },
    timeSaved: { type: String, default: "342" },
    automations: { type: String, default: "12" }
  }
});

const User = mongoose.model('User', userSchema);

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: String, required: true },
  messages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// ========== API ROUTES ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexusAI Backend with OpenRouter', timestamp: new Date() });
});

// SIGNUP
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, stats: user.stats }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER STATS
app.get('/api/user/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('stats');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE CHAT
app.post('/api/chat/save', async (req, res) => {
  try {
    const { userId, agentId, messages } = req.body;

    let chat = await Chat.findOne({ userId, agentId });
    if (chat) {
      chat.messages.push(...messages);
      chat.updatedAt = new Date();
      await chat.save();
    } else {
      chat = new Chat({ userId, agentId, messages });
      await chat.save();
    }
    res.json({ success: true, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET CHAT HISTORY
app.get('/api/chat/:userId/:agentId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId, agentId: req.params.agentId });
    res.json({ messages: chat?.messages || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN - GET ALL USERS
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ MongoDB Atlas Connected`);
  console.log(`🤖 AI Endpoint: /api/chat/ai using OpenRouter (${process.env.OPENROUTER_API_KEY ? 'Key found' : 'Key MISSING!'})`);
});