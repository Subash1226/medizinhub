define([
    "jquery",
    "Magento_Ui/js/grid/columns/thumbnail",
    "Magento_Ui/js/modal/alert",
], function ($, Thumbnail, alert) {
    "use strict";

    return Thumbnail.extend({
        defaults: {
            bodyTmpl: "Quick_Order/grid/columns/thumbnail-multiimage",
            altField: "name",
            has_preview: "0",
            sortable: false,
            label: "Images",
            sortOrder: 1,
        },

        getAlt: function (record) {
            return record[this.altField];
        },

        getImages: function (record) {
            return record[this.index];
        },

        render: function (record) {
            var content = "";
            var images = this.getImages(record);

            images.forEach(function (image) {
                if (image.isPdf) {
                    content +=
                        "<img src='" +
                        image.url +
                        "' alt='PDF Icon' class='thumbnail-pdf' data-pdf-url='" +
                        image.pdfUrl +
                        "' style='cursor: pointer;' /><br/>";
                } else {
                    content +=
                        "<img src='" +
                        image.url +
                        "' width='50px' height='50px' class='thumbnail-image' data-image-url='" +
                        image.url +
                        "' />";
                }
            });

            return content;
        },

        initObservable: function () {
            this._super();

            var self = this;

            $(document).on("click", ".thumbnail-pdf", function () {
                var pdfUrl = $(this).data("pdf-url");
                window.open(pdfUrl, "_blank");
            });

            $(document).on("click", ".thumbnail-image", function () {
                var imageUrl = $(this).data("image-url");
                alert({
                    content:
                        '<img src="' +
                        imageUrl +
                        '" class="prescription-popup-image" width="445px" />',
                    modalClass: "preview-image",
                });
            });

            return this;
        },
    });
});
