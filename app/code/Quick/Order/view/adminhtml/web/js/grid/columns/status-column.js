define(["Magento_Ui/js/grid/columns/select"], function (Select) {
    "use strict";

    return Select.extend({
        defaults: {
            bodyTmpl: "ui/grid/cells/html",
        },

        getLabel: function (record) {
            var value = this._super(record);
            switch (value) {
                case "0":
                    return "Order Cancelled";
                case "1":
                    return "Order Placed";
                case "2":
                    return "Order Under Review";
                case "3":
                    return "Order Accepted";
                case "4":
                    return "Order Rejected";
                default:
                    return value;
            }
        },
    });
});
