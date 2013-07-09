(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData;
    var localSettings = appData.current.localSettings.values;
    WinJS.Namespace.define("GridDice", {

        // SavedGameManager object definition
        SavedGameManager: {

            clearSavedGame: function () {
                // TODO: I'm cheating by using settings.
                localSettings["savedGame"] = null;
                if (Windows.ApplicationModel.IsBluesky)
                    localSettings._blueskyPersist();
            },

            hasSavedGame: function () {
                if (localSettings.hasKey("savedGame")) {
                    var saveData = JSON.parse(localSettings["savedGame"]);
                    return saveData != null;
                }
                return false;

            },

            restoreGame: function (gameBoardModel, scoreManagerModel) {
                var saveData = JSON.parse(localSettings["savedGame"]);
                gameBoardModel.restoreGame(saveData);
                scoreManagerModel.restoreGame(saveData);
            },

            saveGame: function (gameBoardModel, scoreManagerModel) {
                var saveData = {};
                gameBoardModel.saveGame(saveData);
                scoreManagerModel.saveGame(saveData);
                localSettings["savedGame"] = JSON.stringify(saveData, null, 2);
                if (Windows.ApplicationModel.IsBluesky)
                    localSettings._blueskyPersist();
            }
        }
    });
})();
