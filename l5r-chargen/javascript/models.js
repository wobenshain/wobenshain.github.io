app.TemplatesModel = Backbone.Model.extend({
  defaults: {},
  fetch: function() {
    var $that = this,
      templateList = ["main","main.header","main.core","main.traits"],
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
    header: {},
    core: {}
  }
});

app.HeaderModel = Backbone.Model.extend({
  defaults: {
    xp_total: 0,
    xp_display: 75,
    insight: 100
  }
});

app.CoreModel = Backbone.Model.extend({
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
});

app.TraitsModel = Backbone.Model.extend({
  defaults: {
    "air": 2,
    "agility": 2,
    "awareness": 2,
    "earth": 2,
    "fire": 2,
    "intelligence": 2,
    "perception": 2,
    "reflexes": 2,
    "stamina": 2,
    "strength": 2,
    "water": 2,
    "willpower": 2,
    "void_trait": 2
  }
});
