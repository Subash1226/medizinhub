define(["jquery", "underscore", "mageUtils", "uiRegistry"], function (
    $,
    _,
    utils,
    registry
) {
    "use strict";

    return function (config) {
        var statusColumn = registry.get(config.name);

        if (!statusColumn) {
            return;
        }

        statusColumn.on("update", function (row) {
            var statusValue = row.data[config.index];

            console.log("Status value:", statusValue);
        });
    };
});
