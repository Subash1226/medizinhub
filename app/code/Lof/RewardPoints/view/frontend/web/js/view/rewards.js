/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function (Component, customerData) {
    'use strict';

    return Component.extend({
        initialize: function () {
            this._super();
            this.rewardpoints = customerData.get('rewardpoints');

            try {
                customerData.reload(['rewardpoints'], true);
            } catch (error) {
                console.error('Error reloading reward points data:', error);
            }
        }
    });
});