/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */

define([
    'jquery',
    'Magento_Checkout/js/view/summary/shipping',
    'Magento_Catalog/js/price-utils',
    'Magento_Checkout/js/model/quote'
], function ($, Component, priceUtils, quote) {
    'use strict';

    var displayMode = window.checkoutConfig.reviewShippingDisplayMode;
    return Component.extend({
        defaults: {
            displayMode: displayMode,
            template: 'Magento_Tax/checkout/summary/shipping'
        },

        /**
         * @return {Boolean}
         */
        isBothPricesDisplayed: function () {
            return this.displayMode == 'both'; //eslint-disable-line eqeqeq
        },

        /**
         * @return {Boolean}
         */
        isIncludingDisplayed: function () {
            return this.displayMode == 'including'; //eslint-disable-line eqeqeq
        },

        /**
         * @return {Boolean}
         */
        isExcludingDisplayed: function () {
            return this.displayMode == 'excluding'; //eslint-disable-line eqeqeq
        },

        /**
         * @return {*|Boolean}
         */
        isCalculated: function () {
            return this.totals() && this.isFullMode() && quote.shippingMethod() != null;
        },

        /**
         * @return {*}
         */
        getIncludingValue: function () {
            var price;

            if (!this.isCalculated()) {
                return this.notCalculatedMessage;
            }
            price = this.totals()['shipping_incl_tax'];
            console.log('Including Shipping Price:', price);

            return this.getFormattedPrice(price);
        },

        /**
         * @return {*}
         */
        getExcludingValue: function () {
            var price;

            if (!this.isCalculated()) {
                return this.notCalculatedMessage;
            }
            price = this.totals()['shipping_amount'];
            console.log('Excluding Shipping Price:', price);

            return this.getFormattedPrice(price);
        },

        getValue: function () {
            var price;
            price = this.totals()['shipping_amount'];            
            return priceUtils.formatPrice(price, {
                pattern: '%s',
                decimalSymbol: '.',
                groupSymbol: ',',
                groupLength: 3,
                integerRequired: false
            });
        }
    });
});
