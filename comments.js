//create web server
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 3000;

//set up body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set up static files
app.use(express.static(path.join(__dirname, 'public')));

//set up comments file
const comments = path.join(__dirname, 'comments.json');

//set up routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', (req, res) => {
    res.sendFile(comments);
});

app.post('/comments', (req, res) => {
    fs.readFile(comments, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        const comments = JSON.parse(data);
        const newComment = {
            name: req.body.name,
            comment: req.body.comment,
            timestamp: new Date()
        };
        comments.push(newComment);
        fs.writeFile(comments, JSON.stringify(comments), (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});