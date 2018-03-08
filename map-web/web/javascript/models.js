app.TemplatesModel = Backbone.Model.extend({
    defaults: {},
    fetch: function() {
        var $that = this,
            templateList = ["main","inputs","upload","files","grouping","results","geo"],
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

app.FilesModel = Backbone.Model.extend({
    defaults: {
        files: []
    },
    url: '/GSE',
    parse: function(resp) {
        resp.files.map(function(entry) {
            for (var prop in entry) {
                entry[prop] = entry[prop].split("")
                    .map(function (char) {
                        var charCode = char.charCodeAt(0);
                        return charCode > 127 ? '&#'+charCode+';' : char;
                    }).join("");
            }
            entry.group = null;
        });
        resp.tableOrder.push('group');
        console.log(resp);
        return resp;
    }
});

app.GroupingModel = Backbone.Model.extend({
    defaults: {}
});

app.ResultsModel = Backbone.Model.extend({
    defaults: {
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
