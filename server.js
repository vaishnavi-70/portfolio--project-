require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const localProjects = [
    { id: 1, title: "Real-Time Disaster Monitoring & Training System", description: "A comprehensive system designed for monitoring environmental parameters in real-time and providing simulated training modules for emergency handling.", tech: "C#, .NET Framework", github: "https://github.com/vaishnavi-70" },
    { id: 2, title: "Intermediate Code Generator", description: "A compiler design component that processes specific assembly instructions to generate Variant I intermediate code along with dynamic symbol tables.", tech: "Compiler Design, Assembly", github: "https://github.com/vaishnavi-70" },
    { id: 3, title: "Advanced B+ Tree Structure Implementation", description: "A data structure implementation showcasing the step-by-step construction and optimization of a B+ Tree with key index ordering.", tech: "Data Structures, Algorithms", github: "https://github.com/vaishnavi-70" }
];
let isDbConnected = false;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully! 🎉");
        isDbConnected = true;
        seedDatabase();
    })
    .catch(err => {
        console.log("⚠️ MongoDB Network/IP Blocked. Running smoothly with local fallback data! ✨");
    });

const projectSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    tech: String,
    github: String
});

const Project = mongoose.model('Project', projectSchema);

async function seedDatabase() {
    try {
        const count = await Project.countDocuments();
        if (count === 0) {
            await Project.insertMany(localProjects);
            console.log("Database seeded successfully!");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// API Endpoint
app.get('/api/projects', async (req, res) => {
    try {
        if (isDbConnected) {
            const dbProjects = await Project.find().sort({ id: 1 });
            return res.json(dbProjects);
        } else {
            return res.json(localProjects);
        }
    } catch (error) {
        res.json(localProjects);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});