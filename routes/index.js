module.exports = function(app) {

  app.get('/', require('./frontpage').get);
  app.post('/calendar_data', require('./slide').viewData);

  app.get('/slide', require('./slide').getAll);
//    app.get('/slide/:id', require('./slide').getOne);
  app.post('/slide', require('./slide').add);
  app.post('/slide/:id', require('./slide').update);
//    app.delete('/slide', require('./slide').delete);

};
