mongofoo
========

Resourceful JSON API for Mongo in Node+Express

Thanks @gett for `mongojs` https://github.com/gett/mongojs

**Install:**

    npm install mongofoo

**Usage:**

    var express, mongofoo, application;

    express = require('express');
    mongofoo = require('mongofoo');

    application = express();
    application.listen(4567);

    // The connection string is the standard one
    mongofoo.connect('localhost/mydb');

    // Mount onto an application
    mongofoo.mount(application);

    // Register a new resource
    mongofoo.resource('tasks'); // This will expose:
                                //
                                // GET /tasks
                                // POST /tasks
                                // GET /tasks/:id
                                // PUT /tasks/:id
                                // DELETE /tasks/:id

Optionally you can provide a hash of custom actions for that resource:

    mongofoo.resource('tasks', {

      // GET /tasks/done
      'GET /done': function(request, response) {
        // `this` here will refer to the mongo collection object, so you can have access to [its API](http://www.mongodb.org/display/DOCS/Collections)
      }
    });