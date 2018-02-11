app.TemplatesView = Backbone.View.extend({
  el: '#templates',
  initialize: function() {
    app.templates = this;
    this.model.on({
      'change': this.load
    },this);
    this.parse.apply(this);
  },
  get: function(templateName) {
    return this.model.get(templateName);
  },
  load: function() {
    new app.EventsCollection().fetch().done(function(collection) {
      app.views.main = new app.MainView({
        model: new app.MainModel({
          eventList: collection.slice(),
          eventSubset: collection.slice()
        })
      });
    });
  },
  parse: function() {
    var templateObject = {};
    this.$el.children().each(function(i,elem) {
      templateObject[$(elem).attr('name')] = _.template($(elem).val());
    });
    this.model.set(templateObject);
  }
});

app.MainView = Backbone.View.extend({
  el: '#main',
  initialize: function() {
      this.template = app.templates.get('main');
      this.model.on({
        'change:eventSubset': this.passUpdates
      }, this);
      this.render.apply(this);
  },
  render: function() {
    this.$el.html(this.template());
    app.models.table = new app.TableModel({
      parentModel: this.model,
      eventList: this.model.get('eventList'),
      eventSubset: this.model.get('eventSubset'),
      headers: [
        {
          name:'time',
          rangeable: true,
          format: app.functions.formatTimestamp,
          parse: function(date) {
            return Date.parse(date);
          }
        }, {
          name: 'type',
          rangeable: false
        }, {
          name: 'value',
          rangeable: true
        }
      ],
      sortAsc: false
    });
    app.views.table = new app.TableView({
      model: app.models.table
    });
    app.models.visual = new app.VisualModel({
      eventSubset: this.model.get('eventSubset')
    });
    app.views.visual = new app.VisualView({
      model: app.models.visual
    });
  },
  passUpdates: function() {
    var eventSubset = this.model.get('eventSubset');
    app.models.table.set('eventSubset',eventSubset);
    app.models.visual.set('eventSubset',eventSubset);
  }
});

app.TableView = Backbone.View.extend({
  el: "#table",
  initialize: function () {
      this.model.on({
          'reset': this.render,
          'change:eventSubset': this.triggerUpdate,
          'change:pageNumber': this.renderTable,
          'change:pageCount': this.renderTable
      }, this);
      this.template = app.templates.get('table');
      this.pagingTemplate = app.templates.get('tablePaging');
      this.render();
  },
  events: {
    'change select': 'entryCount',
    'keyup input[type="text"]': 'columnSearch',
    'click #pagingRow a': 'pageTab',
    'click [data-table-header]': 'sortColumn',
    'keypress [data-table-header]': 'passClick'
  },
  columnSearch: function(e) {
    var e = $(e.target),
        min = e.hasClass('min'),
        max = e.hasClass('max'),
        minmax = '',
        name = e.prop('name'),
        headers = this.model.get('headers'),
        header = headers.filter(function(header) { return header.name===name; })[0],
        value = header.parse === undefined?e.val():header.parse(e.val()),
        subset = false,
        eventSubset = this.model.get('eventSubset');
    if (min) {
      minmax = "min";
      value = parseFloat(value);
      oldValue = this.model.get(name+minmax);
      if (isNaN(value)) { value = Number.NEGATIVE_INFINITY; }
      if (oldValue === undefined) { oldValue = Number.NEGATIVE_INFINITY; }
      if (value >= oldValue) {
        subset = true;
        eventSubset = eventSubset.filter(function(entry) {
          var source = parseFloat(entry[name]);
          return (isNaN(source)?Number.NEGATIVE_INFINITY:source) >= value;
        });
      }
    } else if (max) {
      minmax = "max";
      value = parseFloat(value);
      oldValue = this.model.get(name+minmax);
      if (isNaN(value)) { value = Number.POSITIVE_INFINITY; }
      if (oldValue === undefined) { oldValue = Number.POSITIVE_INFINITY; }
      if (value <= oldValue) {
        subset = true;
        eventSubset = eventSubset.filter(function(entry) {
          var source = parseFloat(entry[name]);
          return (isNaN(source)?Number.POSITIVE_INFINITY:source) <= value;
        });
      }
    } else {
      value = (value||'').toLowerCase();
      oldValue = this.model.get(name)||'';
      if (value.indexOf(oldValue) > -1) {
        subset = true;
        eventSubset = eventSubset.filter(function(entry) {
          return String(entry[name]).toLowerCase().indexOf(value) > -1;
        });
      }
    }
    this.model.set(name+minmax,value);
    if (!subset) {
      eventSubset = this.model.get('eventList').sort(app.sorts.property(this.model.get('sortHeader'),this.model.get('sortAsc')));
      for (var index in headers) {
        var headerName = headers[index].name,
            val = this.model.get(headerName),
            min = parseFloat(this.model.get(headerName+"min")),
            max = parseFloat(this.model.get(headerName+"max"));
        if (!isNaN(min)) {
          if (!isNaN(max)) {
            eventSubset = eventSubset.filter(function(entry) {
              var source = parseFloat(entry[headerName]);
              return (isNaN(source)?Number.NEGATIVE_INFINITY:source) >= min && (isNaN(source)?Number.POSITIVE_INFINITY:source) <= max;
            });
          } else {
            eventSubset = eventSubset.filter(function(entry) {
              var source = parseFloat(entry[headerName]);
              return (isNaN(source)?Number.NEGATIVE_INFINITY:source) >= min;
            });
          }
        } else if (!isNaN(max)) {
          eventSubset = eventSubset.filter(function(entry) {
            var source = parseFloat(entry[headerName]);
            return (isNaN(source)?Number.POSITIVE_INFINITY:source) <= max;
          });
        } else if (val !== undefined && val !== null) {
          eventSubset = eventSubset.filter(function(entry) {
            var source = String(entry[headerName]).toLowerCase();
            return source.indexOf(String(val)) > -1;
          });
        }
      }
    }
    this.model.set({
      'eventSubset': eventSubset,
      'pageNumber': 1,
      'pageCount': Math.ceil(eventSubset.length/this.model.get('entryCount'))
    });
  },
  entryCount: function(e) {
      var entryCount = $(e.target).val();
      this.model.set({
          'entryCount': entryCount,
          'pageNumber': 1,
          'pageCount': Math.ceil(this.model.get('eventSubset').length/entryCount)
      });
  },
  pageTab: function(e) {
      e.preventDefault();
      var e = $(e.target);
      if (e.parent().hasClass('disabled')) return;
      var val = e.html(),
          pageNumber = this.model.get('pageNumber');
      if (val == 'Next') {
          pageNumber = Math.min(pageNumber+1,this.model.get('pageCount'))||1;
      } else if (val == 'Previous') {
          pageNumber = Math.max(1,pageNumber-1);
      } else {
          pageNumber = parseInt(val);
      }
      this.model.set('pageNumber',pageNumber);
  },
  passClick: function(e) {
      e.preventDefault();
      if (e.keyCode == 13 || e.keyCode == 32) {
          $(e.target).trigger('click');
      }
      return false;
  },
  sortColumn: function(e) {
      e.preventDefault();
      var e = $(e.target),
          sortAsc = !e.hasClass('asc'),
          sortHeader = e.attr('data-table-header'),
          eventSubset = this.model.get('eventSubset');
      e.toggleClass('asc',sortAsc).toggleClass('dsc',!sortAsc).siblings().removeClass('asc').removeClass('dsc');
      eventSubset.sort(app.sorts.property(sortHeader,sortAsc));
      this.model.set({
          'sortAsc': sortAsc,
          'sortHeader': sortHeader
      });
      this.model.trigger('change:eventSubset',this.model);
  },
  render: function () {
    this.$el.html(this.template(this.model.attributes));
    this.renderTable.apply(this);
  },
  renderTable: function() {
      var eventSubset = this.model.get('eventSubset'),
          pageNumber = this.model.get('pageNumber'),
          headers = this.model.get('headers'),
          entryCount = this.model.get('entryCount');
      this.$el.find('tbody').empty();
      var tr = '';
      for (var index = (pageNumber-1)*entryCount; index < Math.min(pageNumber*entryCount,eventSubset.length); index++) {
          tr += '<tr>';
          for (var orderIndex in headers) {
              var header = headers[orderIndex],
                  val = eventSubset[index][header.name];
              tr += '<td>'+(val === undefined?"NA":header.format===undefined?val:header.format(val))+'</td>';
          }
          tr += '</tr>';
      }
      this.$el.find('tbody').append(tr);
      this.$el.find('#pagingRow').html(this.pagingTemplate(this.model.attributes));
  },
  triggerUpdate: function() {
    this.model.get('parentModel').set('eventSubset',this.model.get('eventSubset'));
    this.renderTable.apply(this);
  }
});

app.VisualView = Backbone.View.extend({
  el: '#visual',
  initialize: function() {
    this.model.on({
      'reset': this.render,
      'change': this.graph
    }, this);
    this.template = app.templates.get('visual');
    this.render();
  },
  events: {
    'change select': app.events.updateModel
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.graph.apply(this);
  },
  graph: function() {
    var eventSubset = this.model.get('eventSubset'),
        limit = this.model.get('graphLimit'),
        type = this.model.get('graphType');
    if (limit !== "") {
      var eventSlice = Math.floor(Math.random()*(eventSubset.length-1000));
      eventSubset = eventSubset.slice(eventSlice,eventSlice+1000);
    }

    var data = [],
        layout = {
          showlegend: false,
          height: 600,
          width: this.$el.width()
        };

    switch (type) {
      case 'marker':
        data = [{
          x: eventSubset.map(function(event) { return app.functions.formatTimestamp(event.time); }),
          y: eventSubset.map(function(event) { return event.type; }),
          mode: 'markers',
          marker: {
            size: eventSubset.map(function(event) { return event.value; })
          }
        }];
        layout.title = 'Event Magnitude';
        break;
      case 'incidents':
        var typeMap = {};
        data = {
          values: [],
          labels: [],
          type: 'pie'
        };
        eventSubset.map(function(event) { typeMap[event.type] = (typeMap[event.type]||0)+1; });
        for (var type in typeMap) {
          data.values.push(typeMap[type]);
          data.labels.push(type);
        }
        data = [data];
        layout.title = 'Incidents by Type';
        break;
      case 'impact':
        var typeMap = {};
        data = {
          values: [],
          labels: [],
          type: 'pie'
        };
        eventSubset.map(function(event) { typeMap[event.type] = (typeMap[event.type]||0)+event.value; });
        for (var type in typeMap) {
          data.values.push(typeMap[type]);
          data.labels.push(type);
        }
        data = [data];
        layout.title = 'Impact by Type';
        console.log(data);
        break;
      default:
        break;
    }
    Plotly.purge('graph');
    Plotly.newPlot('graph', data, layout);
  }
});