function Mongofoo() {
  this.mongo = require('mongojs');
}

Mongofoo.prototype = {

  // open mongo connection
  connect: function(value) {
    this.database = this.mongo.connect(value);
  },

  // mount mongofoo to an application
  mount: function(application) {
    this.application = application;
  },

  // create new resource; open new mongo collection and map restful routes
  resource: function(name) {
    var root, shittyId, fetchMany, create, fetchOne, update, destroy;

    root = this;

    shittyId = function(value) {
      return !(typeof value === 'string' && value.length === 24);
    };

    fetchMany = function(request, response) {
      root.database[name].find(request.query, function(err, docs) {
        response.send(docs, { contentType: 'application/json' });
      });
    };

    fetchOne = function(request, response) {
      if(shittyId(request.params.id)) {
        return response.send('', { contentType: 'application/json' }, 404);
      }

      root.database[name].findOne({
        _id: root.mongo.ObjectId(request.params.id)
      }, function(error, value) {
        response.send(value || '', { contentType: 'application/json' }, value ? 200 : 404);
      });
    };

    create = function(request, response) {
      if(request.body._id) {
        delete request.body._id;
      }

      root.database[name].save(request.body, function(err, value) {
        response.send(value, { contentType: 'application/json' }, 201);
      });
    };

    update = function(request, response) {
      if(shittyId(request.params.id)) {
        return response.send('', { contentType: 'application/json' }, 404);
      }

      request.body._id = root.mongo.ObjectId(request.params.id);

      root.database[name].save(request.body, function(err, value) {
        response.send(value, { contentType: 'application/json' }, 200);
      });
    };

    destroy = function(request, response) {
      if(shittyId(request.params.id)) {
        return response.send('', { contentType: 'application/json' }, 404);
      }

      root.database[name].remove({ _id: root.mongo.ObjectId(request.params.id) }, function(err, value) {
        response.send('', { contentType: 'application/json' }, 200);
      });
    };

    this.database[name] = this.database.collection(name);

    this.application.get('/' + name, fetchMany);
    this.application.post('/' + name, create);
    this.application.get('/' + name + '/:id', fetchOne);
    this.application.put('/' + name + '/:id', update);
    this.application.delete('/' + name + '/:id', destroy);
  }
};

module.exports = new Mongofoo();