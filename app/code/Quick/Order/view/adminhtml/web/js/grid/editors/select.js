define(["Magento_Ui/js/form/element/select"], function (Select) {
    "use strict";

    return Select.extend({
        defaults: {
            imports: {
                updateValue: "${ $.provider }:${ $.dataScope }",
            },
        },

        /**
         * Update the value in the data provider.
         *
         * @param {String} value
         */
        updateValue: function (value) {
            this.source.set(this.dataScope, value);
        },
    });
});
