var _, mongo;

_ = require('underscore');
mongo = require('mongojs');

function Mongofoo() {
}

Mongofoo.prototype = {

  // open database connection
  connect: function(value) {
    this.database = mongo.connect(value);
  },

  // mount mongofoo onto an application
  mount: function(application) {
    this.application = application;
  },

  // try to instance an ObjectId, returns false if fail
  objectID: function(value) {
    return typeof value === 'string' && value.length === 24 && mongo.ObjectId(value);
  },

  // register new resource with optional custom actions
  resource: function(name, actions) {
    var resource, objectID;

    objectID = this.objectID;

    resource = this.database[name] = this.database.collection(name);

    _.each(actions || {}, function(action, route) {
      var re, parts;

      re = /(GET|POST|PUT|DELETE) (\/.+)/;

      if(!re.exec(route)) {
        return true;
      }

      console.log('Custom action:', route);

      parts = route.match(re);

      this.application[parts[1].toLowerCase()]('/' + name + parts[2], function(request, response) {
        action.apply(resource, [request, response]);
      });

    }, this);

    // GET /resources
    this.application.get('/' + name, function(request, response) {
      resource.find(request.query, function(err, docs) {
        response.json(docs);
      });
    });

    // GET /resources/1
    this.application.get('/' + name + '/:id', function(request, response) {
      if(!objectID(request.params.id)) {
        return response.json('', 404);
      }

      resource.findOne({
        _id: objectID(request.params.id)
      }, function(error, docs) {
        response.json(docs || '', docs ? 200 : 404);
      });
    });

    // POST /resources
    this.application.post('/' + name, function(request, response) {
      if(request.body._id) {
        delete request.body._id;
      }

      resource.save(request.body, function(err, docs) {
        response.json(docs, 201);
      });
    });

    // PUT /resources/1
    this.application.put('/' + name + '/:id', function(request, response) {
      if(!objectID(request.params.id)) {
        return response.json('', 404);
      }

      request.body._id = objectID(request.params.id);
      delete request.params.id;

      resource.save(request.body, function(err, docs) {
        response.json(docs, 200);
      });
    });

    // PUT /resources/1
    this.application.delete('/' + name + '/:id', function(request, response) {
      if(!objectID(request.params.id)) {
        return response.json('', 404);
      }

      resource.remove({
        _id: objectID(request.params.id)
      }, function(err, docs) {
        response.json(docs, 200);
      });
    });
  }
};

module.exports = new Mongofoo();