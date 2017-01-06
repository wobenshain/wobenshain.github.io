app.MainView = Backbone.View.extend({
    el: 'body',
    initialize: function() {
        this.template = _.template(app.templates.get('main'));
        this.render.apply(this);
        app.models.header = new app.HeaderModel();
        app.views.header = new app.HeaderView({
            model: app.models.header
        });
        app.models.basics = new app.BasicsModel({
            clans: app.rules.clans
        });
        app.views.basics = new app.BasicsView({
            model: app.models.basics
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
        this.template = _.template(app.templates.get('header'));
        this.render.apply(this);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.BasicsView = Backbone.View.extend({
    el: '#tab-basics',
    initialize: function() {
        this.template = _.template(app.templates.get('basics'));
        this.model.on({
            'change:families': this.render
        },this);
        this.render.apply(this);
    },
    events: {
        'change [name="clan"]': function(e) {
            var val = $(e.target).val(),
                clan = this.model.get('clans')[val];
            this.model.set({
                'clan': val,
                'family': "",
                'families': clan.families,
                'schools': clan.schools
            });
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});
