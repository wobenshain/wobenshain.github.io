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
    }
});

app.InputsView = Backbone.View.extend({
    el: '#map-inputs',
    initialize: function() {
        this.template = _.template(app.templates.get('inputs'));
        this.model.on({
            'change:project_id': this.showAnalysisType,
            'change:analysis_type': this.showFiles
        }, this);
        this.render.apply(this);
    },
    events: {
        'keyup input[type="text"]': 'restrictCharacters',
        'change select': app.events.updateModel
    },
    restrictCharacters: function(e) {
        $(e.target).val($(e.target).val().replace(/[^A-Za-z0-9._]/g,''));
        app.events.updateModel.call(this,e);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    },
    showAnalysisType: function() {
        this.$el.find('[name="analysis_type"]').parent().toggleClass('show',this.model.get('project_id') !== '');
    },
    showFiles: function() {
        var type = this.model.get('analysis_type');
        app.models.files = new app.FilesModel();
        switch (type) {
            case 'CEL':
                app.views.files = new app.CelsView({
                    model: app.models.files
                });
                break;
            case 'GEO':
                app.views.files = new app.GeoView({
                    model: app.models.files
                });
                break;
            default:
        }
    }
});

app.CelsView = Backbone.View.extend({
    el: '#map-files',
    initialize: function() {
        this.template = _.template(app.templates.get('inputs'));
        this.render.apply(this);
    },
    events: {
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.GeoView = Backbone.View.extend({
    el: '#map-files',
    initialize: function() {
        this.template = _.template(app.templates.get('geo'));
        this.render.apply(this);
    },
    events: {
        'keyup input': app.events.updateModel,
        'click button': 'loadGSE'
    },
    loadGSE: function(e) {
        var $that = this;
        this.model.fetch({
            method: 'POST',
            data: {
                'gsecode': this.model.get('gsecode')
            }
        }).done(function() {
            var selected = {};
            $that.model.get('files').map(function(e,i) { selected[i] = false; });
            app.models.grouping = new app.GroupingModel({
                files: $that.model.get('files'),
                tableOrder: $that.model.get('tableOrder'),
                selected: selected
            });
            app.views.grouping = new app.GroupingView({
                model: app.models.grouping
            });
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.GroupingView = Backbone.View.extend({
    el: '#map-grouping',
    initialize: function() {
        this.template = _.template(app.templates.get('grouping'));
        this.model.on({
            'change:applying': this.renderApply,
            'change:group_name': this.renderApply
        }, this);
        this.render.apply(this);
    },
    events: {
        'keyup input': app.events.updateModel,
        'click tbody tr': 'selectRow',
        'click button': 'applyGroup'
    },
    selectRow: function(e) {
        var row = this.model.get('table').row(e.currentTarget);
        if (this.model.get('applying')) {
            var group_name = this.model.get('group_name');
            row.data().group = group_name;
            row.invalidate().draw('page');
        } else {
            if ($(row.node()).hasClass('selected')) {
                row.deselect();
            } else {
                row.select();
            }
        }
    },
    applyGroup: function(e) {
        var table = this.model.get('table'),
            group_name = this.model.get('group_name'),
            rows = table.rows({selected: true});
        if (rows[0].length > 0) {
            rows.data().map(function(e) { e.group = group_name; });
            rows.invalidate().draw('page').deselect();
        } else {
            this.model.set('applying',!this.model.get('applying'));
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.model.set('table',this.$el.find('#map-grouping-table').DataTable({
            data: this.model.get('files'),
            columns: this.model.get('tableOrder').map(function(entry) { return {title:entry,data:entry}; })
        }));
    },
    renderApply: function() {
        var applying = this.model.get('applying');
        this.$el.find('[name="group_name"]').prop('disabled',applying);
        this.$el.find('button[name="apply"]')
            .toggleClass('active',applying)
            .prop('disabled',this.model.get('group_name') == '');
    }
});

/*
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
*/
