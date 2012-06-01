mongofoo
========

Resourceful JSON API for Node (express) and Mongo

Thanks @gett for `mongojs` https://github.com/gett/mongojs

**Install:**

    npm install mongofoo

**Usage:**

    var express, mongofoo, application;

    express = require('express');
    mongofoo = require('mongofoo');
    
    application = express.createServer();
    application.listen(4567);

    // Connect to mongo database
    mongofoo.connect('localhost/mydb');

    // Mount application
    mongofoo.mount(application);

    // Create a new resource, exposing:
    // GET /tasks
    // POST /tasks
    // GET /tasks/:id
    // PUT /tasks/:id
    // DELETE /tasks/:id
    mongofoo.resource('tasks');