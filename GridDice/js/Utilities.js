
WinJS.Namespace.define("GridDice", {

    Utilities: {

        // ================================================================
        //
        showYesNoDialog: function (title) {
            var md = new Windows.UI.Popups.MessageDialog(title);
            var result, resultOptions = ['Yes', 'No'];
            var cmd;

            for (var i = 0; i < resultOptions.length; i++) {
                cmd = new Windows.UI.Popups.UICommand();
                cmd.label = resultOptions[i];
                cmd.invoked = function (c) {
                    result = c.label;
                }
                md.commands.append(cmd);
            }
            return md.showAsync().then(function (c) {
                return result;
            });
        },

        // ================================================================
        //
        showInfoBox: function (title) {
            var md = new Windows.UI.Popups.MessageDialog(title);
            md.showAsync();
        },

        // ================================================================
        //
        // GridDice.Utilities.templateSelector
        //
        //		This function allows the ListView to support heterogenous templates for each item without
        //		any extra work.  Just specify "itemTemplate" (referencing a template in the DOM) in the item's data.
        //
        templateSelector: function (itemPromise) {

            return itemPromise.then(function (currentItem) {

                // Create a clone of the item's template
                var templateInstance = document.getElementsByClassName(currentItem.data.itemTemplate)[0].cloneNode(true);

                // Make the template instance visible (although it won’t be in the DOM yet)
                templateInstance.style.display = "block";

                // Have WinJS perform binding for us between the current item's data and the cloned template
                WinJS.Binding.processAll(templateInstance, currentItem.data);

                // And we're done!  Return the cloned template.
                return templateInstance;
            });
        }
    }
});