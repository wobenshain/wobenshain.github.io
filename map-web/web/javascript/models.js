app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    fetch: function() {
        var $that = this,
            templateList = ["main","inputs","upload","files","grouping","results"],
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
    }
});

app.InputsModel = Backbone.Model.extend({
    defaults: {
        parent: {},
        project_id: "",
        analysis_type: "",
        cel_files: []
    }
});

app.UploadModel = Backbone.Model.extend({
    defaults: {
        parent: {},
        input: {},
        name: "",
        multiple: false,
        accepts: null
    }
});

app.CelModel = Backbone.Model.extend({
    defaults: {}
});

app.GroupingModel = Backbone.Model.extend({
    defaults: {}
});

app.ResultsModel = Backbone.Model.extend({
    defaults: {
    }
});
