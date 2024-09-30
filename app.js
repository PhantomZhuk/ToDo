const express = require(`express`);
const mongoose = require(`mongoose`);
require(`dotenv`).config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));

app.get(`/`, (req, res) => {
    res.sendFile(__dirname, `public`, `index.html`);
})

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log(`MongoDB connected`);
})

const taskSchema = new mongoose.Schema({
    title: String,
    date: Date,
    withTime: String,
    toTime: String,
    completed: Boolean
})

const Task = mongoose.model("Task", taskSchema);

app.post("/api/tasks", (req, res) => {
    console.log(req.body)
    const newTask = new Task ({
        title: req.body.title,
        date: req.body.date,
        withTime: req.body.withTime,
        toTime: req.body.toTime,
        completed: req.body.completed
    })

    newTask.save();
    res.json(newTask);
})

app.get(`/`, (req, res) => {
    res.sendFile(__dirname , "public", "index.html");
})

app.get(`/calendar`, (req, res) => {
    res.sendFile(__dirname , "public", "calendar", "index.html");
})

app.get(`/api/tasks`, (req, res) => {
    Task.find()
    .then((tasks) => {
        res.json(tasks);
    })
    .catch((err) => {
        console.log(err);
    })
})

app.delete(`/app/tasks/:id`, (req, res) => {
    Task.findByIdAndDelete(req.params.id)
    .then(() => {
        res.json({message: "Task deleted"});
    })
    .catch((err) => {
        console.log(err);
    })
})

app.put(`/api/tasks/:id`, (req, res) => {
    Task.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        res.json({message: "Task updated"});
    })
    .catch((err) => {
        console.log(err);
    })
})

app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
})