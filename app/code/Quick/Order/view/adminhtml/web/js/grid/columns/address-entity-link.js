define(["Magento_Ui/js/grid/columns/column"], function (Column) {
    "use strict";

    return Column.extend({
        defaults: {
            bodyTmpl: "ui/grid/cells/html",
            fieldClass: {
                "data-grid-address-entity-link-cell": true,
            },
        },

        getHref: function (row) {
            var entityId = row.entity_id;
            return this.options.url + "entity_id/" + entityId; 
        },

        getLabel: function (row) {
            return "Address Entity"; 
        },
    });
});
