app.MainView = Backbone.View.extend({
    el: 'body',
    initialize: function() {
        this.template = _.template(app.templates.get('main'));
        this.render.apply(this);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        app.models.inputs = new app.InputsModel({
            parent: this.$el
        });
        app.views.inputs = new app.InputsView({
            model: app.models.inputs
        });
        /*
        app.models.controls = new app.ControlsModel({
            parent: this.$el
        });
        app.views.controls = new app.ControlsView({
            model: app.models.controls
        });
        app.models.results = new app.ResultsModel();
        app.views.results = new app.ResultsView({
            model: app.models.results
        });
        */
    }
});

app.InputsView = Backbone.View.extend({
    el: '#map-inputs',
    initialize: function() {
        this.template = _.template(app.templates.get('inputs'));
        this.model.on({
            'change:project_id': this.showNext,
            'change:cel_files': this.showNext,
            'change:pheno_file': this.showNext,
            'change:contrast_file': this.showNext            
        }, this)
        this.render.apply(this);
    },
    events: {
        'keyup input[type="text"]': app.events.updateModel
    },
    showNext: function(e) {
        for (var prop in e.changed) {
            var val = e.changed[prop],
                next = this.$el.find('[name="'+prop+'"]').closest('li').next(),
                show = Array.isArray(val)?val.length > 0:val!="";
            if (next.length > 0) {
                next.toggleClass('show',show);
            } else {
                this.model.get('parent').find('#map-controls').toggleClass('show',show);
            }
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        app.models.cel_files = new app.UploadModel({
            input: this.model,
            name: 'cel_files',
            multiple: true
        });
        app.views.cel_files = new app.UploadView({
            el: '[for="cel_files"] + div',
            model: app.models.cel_files
        });
        app.models.pheno_file = new app.UploadModel({
            input: this.model,
            name: 'pheno_file'
        });
        app.views.pheno_file = new app.UploadView({
            el: '[for="pheno_file"] + div',
            model: app.models.pheno_file
        });
        app.models.contrast_file = new app.UploadModel({
            input: this.model,
            name: 'contrast_file'
        });
        app.views.contrast_file = new app.UploadView({
            el: '[for="contrast_file"] + div',
            model: app.models.contrast_file
        });        
    }
});

app.UploadView = Backbone.View.extend({
    initialize: function(e) {
        this.template = _.template(app.templates.get('upload'));
        this.render.apply(this);
    },
    events: {
        'change input': 'updateModel'
    },
    updateModel: function(e) {
        var input = e.target.files,
            arr = [];
        for (var i = 0; i < input.length; i++) {
            arr.push(e.target.files[i].name);
        }
        if (this.model.get('multiple')) {
            this.model.get('input').set(this.model.get('name'),arr);
        } else {
            this.model.get('input').set(this.model.get('name'),arr[0]);
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.ControlsView = Backbone.View.extend({
    el: '#map-controls',
    initialize: function() {
        this.template = _.template(app.templates.get('controls'));
        this.render.apply(this);
    },
    events: {
        'click #runModel': 'runModel'
    },
    runModel: function(e) {
        this.model.get('parent').find('#map-results').addClass('show');
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.ResultsView = Backbone.View.extend({
    el: '#map-results',
    initialize: function() {
        this.template = _.template(app.templates.get('results'));
        this.render.apply(this);
    },
    events: {
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});
