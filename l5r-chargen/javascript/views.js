app.MainView = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    this.template = _.template(app.templates.get('main'));
    this.render.apply(this);
    app.models.header = new app.HeaderModel();
    app.views.header = new app.HeaderView({
      model: app.models.header
    });
    app.models.core = new app.CoreModel({
      clans: app.rules.clans
    });
    app.views.core = new app.CoreView({
      model: app.models.core
    });
    app.models.traits = new app.TraitsModel();
    app.views.traits = new app.TraitsView({
      model: app.models.traits
    });
  },
  render: function() {
    this.$el.html(this.template(
      _.extend(
        {},
        this.model.attributes,
        { 'ruleset': app.rules.ruleset }
      )
    ));
  }
});

app.HeaderView = Backbone.View.extend({
  el: '#header',
  initialize: function() {
    this.template = _.template(app.templates.get('main.header'));
    this.render.apply(this);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

app.CoreView = Backbone.View.extend({
  el: '#tab-core',
  initialize: function() {
    this.template = _.template(app.templates.get('main.core'));
    this.model.on({
      'change:families': this.render
    },this);
    this.render.apply(this);
  },
  events: {
    'change [name="clan"]': function(e) {
      var val = $(e.target).val(),
          clan = this.model.get('clans')[val],
          schools = {};
      for (var school in clan.schools) {
        schools[school] = _.extend({},clan.schools[school],app.rules.schools[school]);
      }
      this.model.set({
        'clan': val,
        'family': "",
        'families': clan.families,
        'schools': schools
      });
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

app.TraitsView = Backbone.View.extend({
  el: '#tab-traits',
    initialize: function() {
      this.template = _.template(app.templates.get('main.traits'));
      this.render.apply(this);
    },
    events: {
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
    }
});
