# mongofoo

Resourceful JSON API for Express+Mongo

## Install:

    npm install mongofoo

## Usage:

    var express, mongofoo, http;

    express = require('express');
    mongofoo = require('mongofoo');

    http = express();
    http.listen(4567);

    // Open database connection
    mongofoo.connect('localhost/mydb');

    // Mount on the application
    mongofoo.mount(http);

    // GET /tasks
    // POST /tasks {}
    // GET /tasks/:id
    // PUT /tasks/:id {}
    // DELETE /tasks/:id
    mongofoo.resource('tasks');

Optionally you can provide a hash of custom actions for that resource:

    mongofoo.resource('tasks', {

      'GET /done': function(request, response) {
        this.tasks.find({ done: true }).toArray(function(error, tasks) {
          response.json(tasks); 
        })
      }
    });

## Contribute:

This is a pet project I started to toy and learn Node, Mongo, realtime applications and stuff. But I don't see why it couldn't grow and become one serious motherf*cker module for production purposes. Off course it needs to mature until there. So if you like it, got comments or critics, feel free and tell me. You can open an issue, send an email or whatever.