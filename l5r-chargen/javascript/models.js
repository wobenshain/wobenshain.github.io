app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    fetch: function() {
        var $that = this,
            templateList = ["main","header","basics"],
            templateObject = {},
            deferred = $.Deferred(),
            after = _.after(templateList.length,function() {
                $that.set(templateObject);
                deferred.resolve();
            });
        _.each(templateList,function(templateName) {
            $.get('templates/'+templateName+'.html').done(function(response) {
                templateObject[templateName] = response;
                after();
            });
        });
        return deferred;
    }
});

app.MainModel = Backbone.Model.extend({
    defaults: {
        header: {}
    }
});

app.HeaderModel = Backbone.Model.extend({
    defaults: {
        xp_total: 0,
        xp_max: 40,
        insight: 100
    }
})

app.BasicsModel = Backbone.Model.extend({
    defaults: {
        clan: "None",
        family: "",
        name: "",
        school: "",
        pips: {
            "Honor": 1.0,
            "Glory": 1.0,
            "Status": 1.0,
            "Shadowlands Taint": 0.0,
            "Infamy": 0.0
        },
        clans: {},
        families: undefined,
        schools: undefined
    }
})
