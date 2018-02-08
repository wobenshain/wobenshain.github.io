app.MainView = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    this.template = _.template(app.templates.get('main'));
    this.render.apply(this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    app.models.inputs = new app.InputsModel({
      parent: this.$el
    });
    app.views.inputs = new app.InputsView({
      model: app.models.inputs
    });
    app.models.cel = new app.CelModel();
    app.views.cel = new app.CelView({
      model: app.models.cel
    });
  }
});

app.InputsView = Backbone.View.extend({
  el: '#map-inputs',
  initialize: function() {
    this.template = _.template(app.templates.get('inputs'));
    this.model.on({
      'change:project_id': this.showNext,
      'change:analysis_type': this.showNext,
      'change:cel_files': this.showNext
    }, this);
    this.render.apply(this);
  },
  events: {
    'keyup input[type="text"]': 'restrictCharacters',
    'change select': app.events.updateModel
  },
  restrictCharacters: function(e) {
    $(e.target).val($(e.target).val().replace(/[^A-Za-z0-9._]/g,''));
    app.events.updateModel.call(this,e);
  },
  showNext: function(e) {
    for (var prop in e.changed) {
      var val = e.changed[prop],
        next = this.$el.find('[for="'+prop+'"]').closest('div').next(),
        show = Array.isArray(val)?val.length > 0:val!="";
      if (next.length > 0) {
        next.toggleClass('show',show);
      } else {
        console.log(this.model.get('parent').find('#map-controls'));
        this.model.get('parent').find('#map-controls').toggleClass('show',show);
      }
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    app.models.cel_files = new app.UploadModel({
      input: this.model,
      name: 'cel_files',
      multiple: true,
      accepts: ".cel"
    });
    app.views.cel_files = new app.UploadView({
      el: '[for="cel_files"] + div',
      model: app.models.cel_files
    });
  }
});

app.UploadView = Backbone.View.extend({
  initialize: function(e) {
    this.template = _.template(app.templates.get('upload'));
    this.render.apply(this);
  },
  events: {
    'change input': 'updateModel'
  },
  updateModel: function(e) {
    var input = e.target.files,
      arr = [];
    for (var i = 0; i < input.length; i++) {
      arr.push(e.target.files[i].name);
    }
    if (this.model.get('multiple')) {
      this.model.get('input').set(this.model.get('name'),arr);
    } else {
      this.model.get('input').set(this.model.get('name'),arr[0]);
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

app.CelView = Backbone.View.extend({
  el: '#map-cel',
  initialize: function() {
    this.template = _.template(app.templates.get('cel'));
    this.render.apply(this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    app.models.grouping = new app.GroupingModel();
    app.views.grouping = new app.GroupingView({
      model: app.models.grouping
    });
  }
});

app.GroupingView = Backbone.View.extend({
  el: '#map-cel-grouping',
  initialize: function() {
    this.template = _.template(app.templates.get('grouping'));
    this.render.apply(this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

app.ResultsView = Backbone.View.extend({
  el: '#map-cel-results',
  initialize: function() {
    this.template = _.template(app.templates.get('results'));
    this.render.apply(this);
  },
  events: {
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});
