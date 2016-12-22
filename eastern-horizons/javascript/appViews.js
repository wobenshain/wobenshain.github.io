app.BodyView = Backbone.View.extend({
    el: '#input',
    initialize: function() {
        app.models.probability = new app.ProbabilityModel();
        this.model.set('probability',app.models.probability);
        app.views.probability = new app.ProbabilityView({
            model: app.models.probability
        });
        app.views.downloads = new app.DownloadsView();
    }
});
app.ProbabilityView = Backbone.View.extend({
    el: '#tab-probability',
    initialize: function() {
        this.model.on({
            'change:result': this.renderResult
        }, this)
        this.template = _.template(app.templates.get('probability'));
        this.render();
    },
    events: {
        'change input[type="number"]': 'updateModel',
        'click #calculateProbability': 'calculateProbability',
        'submit form': 'noSubmit'
    },
    calculateProbability: function(e) {
        e.preventDefault();
        var card = this.model.get('tn')-this.model.get('bonus'),
            fail = card-1,
            mult = 2,
            prob = 1;
        prob -= fail/13.5;
        var jkrfail = Math.floor(fail/mult);
        while(jkrfail > 0) {
            prob -= jkrfail/Math.pow(27,mult-1)/13.5;
            mult++;
            jkrfail = Math.floor(fail/mult);
        }
        this.model.set({
            'card': card,
            'result': Math.round(prob*1000)/10
        });
    },
    noSubmit: function(e) {
        e.preventDefault();
    },
    updateModel: function(e) {
        e.preventDefault();
        var el = $(e.target);
        this.model.set(el.attr('name'),parseFloat(el.val()));
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    },
    renderResult: function() {
        this.$el.find('.result').html(this.model.get('result')+'%')
    }
})
app.DownloadsView = Backbone.View.extend({
    el: '#tab-downloads',
    initialize: function() {
        this.template = _.template(app.templates.get('downloads'));
        this.render();
    },
    render: function() {
        this.$el.html(this.template({}));
    }
})
