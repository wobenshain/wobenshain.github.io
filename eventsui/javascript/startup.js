var app = {
    functions: {
        formatTimestamp: function(timestamp) {
            return $.format.date(timestamp,"yyyy-MM-dd HH:mm:ss");
        }
    },
    models: {},
    views: {},
    events: {
        updateModel: function (e) {
            var e = $(e.target);
            if (e.attr('type') == 'checkbox') {
                this.model.set(e.attr('name') || e.attr('id'), e.prop('checked'));
            } else {
                this.model.set(e.attr('name') || e.attr('id'), !e.hasClass('selectized') ? e.val() : e.val().length > 0 ? e.val().split(',') : []);
            }
        }
    },
    sorts: {
        "property": function (property,sortAsc) {
            return function (obj1, obj2) {
                var obj1 = obj1[property],
                    obj2 = obj2[property];
                if (isNaN(obj1) || isNaN(obj2)) {
                    obj1 = obj1||"";
                    obj2 = obj2||"";
                    return obj2 > obj1 ? (sortAsc?-1:1) : obj2 < obj1 ? (sortAsc?1:-1) : 0;
                } else {
                    obj1 = parseFloat(obj1);
                    obj2 = parseFloat(obj2);
                    return sortAsc ? obj1 - obj2 : obj2 - obj1;
                }
            };
        },
        "default": function (property) {
            return function (obj1, obj2) {
                return (obj2[property]==0?0:obj2[property]||Number.POSITIVE_INFINITY) - (obj1[property]==0?0:obj1[property]||Number.POSITIVE_INFINITY);
            };
        }
    }
};
