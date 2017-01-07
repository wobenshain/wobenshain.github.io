$(function() {
    var rulesList = ["clans","schools"],
        after = _.after(rulesList.length+1,function() {
            app.models.main = new app.MainModel();
            app.views.main = new app.MainView({
                model: app.models.main
            });
        });
    app.templates = new app.TemplatesModel();
    app.templates.fetch().done(after);
    _.each(rulesList,function(rulesName) {
        $.get('data/'+rulesName+'.json').done(function(response) {
            if (response !== null && typeof response === 'object') {
                app.rules[rulesName] = response;
            } else {
                app.rules[rulesName] = JSON.parse(response);
            }
            after();
        });
    });
});
