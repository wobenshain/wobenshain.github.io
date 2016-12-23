app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    url: 'templates/',
    fetch: function() {
        var $that = this,
            templates = ['carddraw','probability','probability.result','downloads'],
            templateObject = {},
            deferred = $.Deferred(),
            resolve = _.after(templates.length,function() {
                $that.set(templateObject);
                deferred.resolve();
            });
        _.each(templates,function(entry) {
            $.get($that.url+entry+'.html').done(function(data) {
                templateObject[entry] = data;
                resolve();
            });
        });
        return deferred;
    }
});

app.BodyModel = Backbone.Model.extend({
    defaults: {
        probability: {}
    }
});

app.ProbabilityModel = Backbone.Model.extend({
    defaults: {
        bonus: 0,
        cardList: [],
        probability: null,
        tn: 1
    }
});
