// Adapted pre-existing code for use with a server to allow a single-page app
// Without server access. It breaks the MVC model slightly, but its already a
// workaround to ensure maximum portability so, oh well.
app.TemplatesModel = Backbone.Model.extend({
    defaults: {}
});

app.EventModel = Backbone.Model.extend({
    defaults: {
        time: 0,
        type: '',
        value: -1
    },
    parse: function(data) {
        data.time = Date.parse(data.time);
        return data;
    }
});

app.EventsCollection = Backbone.Collection.extend({
    model: app.EventModel,
    url: '/output.js'
});

app.MainModel = Backbone.Model.extend({
    defaults: {
        eventList: []
    }
});

app.VisualModel = Backbone.Model.extend({
    defaults: {
        eventSubset: [],
        graphType: 'impact',
        graphLimit: 1000
    }
});

app.TableModel = Backbone.Model.extend({
    defaults: {
        parentModel: {},
        eventList: [],
        eventSubset: [],
        entryCount: 10,
        headers: [],
        pageNumber: 1,
        pageCount: 1,
        sortHeader: '',
        sortAsc: true
    },
    initialize: function() {
        var pageCount = Math.ceil(this.get('eventSubset').length/this.get('entryCount')),
            pageNumber = Math.min(pageCount,1),
            sortHeader = this.get('headers')[0].name;
        this.set({
            pageCount: pageCount,
            pageNumber: pageNumber,
            sortHeader: sortHeader
        });
    }
});
