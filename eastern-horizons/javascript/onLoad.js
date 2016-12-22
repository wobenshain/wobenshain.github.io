$(function () {
        app.templates = new app.TemplatesModel();
        app.templates.fetch().done(function() {
            app.models.body = new app.BodyModel();
            app.views.body = new app.BodyView({
                model: app.models.body
            });
        });
});