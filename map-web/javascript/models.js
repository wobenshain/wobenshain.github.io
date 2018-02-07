app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    fetch: function() {
        var $that = this,
            templateList = ["main","inputs","upload","controls","results"],
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
        cel_files: [],
        pheno_file: "",
        contrast_file: ""
    }
});

app.UploadModel = Backbone.Model.extend({
    defaults: {
        parent: {},
        input: {},
        name: "",
        multiple: false
    }
});

app.ControlsModel = Backbone.Model.extend({
    defaults: {
        parent: {}
    }
});

app.ResultsModel = Backbone.Model.extend({
    defaults: {
    }
});
