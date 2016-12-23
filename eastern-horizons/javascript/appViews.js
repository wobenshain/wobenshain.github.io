app.BodyView = Backbone.View.extend({
    el: '#input',
    initialize: function() {
        app.views.carddraw = new app.CardDrawView();
        
        app.models.probability = new app.ProbabilityModel();
        this.model.set('probability',app.models.probability);
        app.views.probability = new app.ProbabilityView({
            model: app.models.probability
        });
        
        app.views.downloads = new app.DownloadsView();
    }
});

app.CardDrawView = Backbone.View.extend({
    el: '#tab-carddraw',
    initialize: function() {
        this.template = _.template(app.templates.get('carddraw'));
        this.draw.call(this,{preventDefault:function(){}});
    },
    events: {
        'click': 'draw'
    },
    draw: function(e) {
        e.preventDefault();
        console.log('x');
        var cardList = [],
            card = Math.floor(Math.random()*54)+1;
        while (card > 52) {
            cardList.push(card);
            card = Math.floor(Math.random()*54)+1;
        }
        cardList.push(card);
        card = Math.ceil(card/4);
        var total = card*cardList.length;
        this.$el.html(this.template({
            'cardList': cardList,
            'total': total
        }));
    }
});

app.ProbabilityView = Backbone.View.extend({
    el: '#tab-probability',
    initialize: function() {
        this.template = _.template(app.templates.get('probability'));
        this.resultTemplate = _.template(app.templates.get('probability.result'));
        this.render();
    },
    events: {
        'change input[type="number"]': 'updateModel',
        'click #draw': 'draw',
        'click #calculateProbability': 'calculateProbability',
        'submit form': 'noSubmit'
    },
    calculateProbability: function(e) {
        e.preventDefault();
        var card = this.model.get('tn')-this.model.get('bonus'),
            fail = card-1,
            mult = 2,
            prob = 1;
        prob -= Math.min(fail,13)/13.5;
        var jkrfail = Math.min(Math.floor(fail/mult),13);
        while(jkrfail > 0 && Math.round(prob*1000) > 0) {
            prob -= jkrfail/Math.pow(27,mult-1)/13.5;
            mult++;
            jkrfail = Math.floor(fail/mult);
        }
        var cardList = [];
        mult = 1;
        while(card/mult > 13) {
            cardList.push(53+Math.floor(Math.random()*2)),
            mult++;
        }
        cardList.push(Math.ceil(card/mult)*4-Math.floor(Math.random()*4));
        this.model.set({
            'cardList': cardList,
            'probability': Math.round(prob*1000)/10,
            'total': null
        });
        this.renderResult.apply(this);
    },
    draw: function(e) {
        e.preventDefault();
        var cardList = [],
            card = Math.floor(Math.random()*54)+1;
        while (card > 52) {
            cardList.push(card);
            card = Math.floor(Math.random()*54)+1;
        }
        cardList.push(card);
        card = Math.ceil(card/4);
        var total = card*cardList.length+this.model.get("bonus");
        this.model.set({
            'cardList': cardList,
            'probability': null,
            'total': total
        });
        this.renderResult.apply(this);
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
        this.$el.find('.result').html(this.resultTemplate(this.model.attributes));
    }
});

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
