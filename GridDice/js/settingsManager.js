(function () {
    "use strict";

    WinJS.Namespace.define("GridDice", {

        // HighScoreManager object definition
        SettingsManager: {

            initialize: function () {

                // For demonstration purposes, use the first approach to populating settings...
                WinJS.Application.onsettings = function (e) {
                    e.detail.applicationcommands = {
                        "aboutDiv": { href: "/aboutPane.html", title: "About" },
                    };
                    WinJS.UI.SettingsFlyout.populateSettings(e);
                }
                
                // ... and then use the second for the other commands.
                var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
                settingsPane.oncommandsrequested = this.commandsRequested;
            },

            commandsRequested: function (eventArgs) {

                // Add reset all scores button
                var settingsCommand = new Windows.UI.ApplicationSettings.SettingsCommand("resetAll", "Reset All Scores", GridDice.SettingsManager.resetAll);
                eventArgs.request.applicationCommands.append(settingsCommand);

                // Add privacy policy link
                settingsCommand = new Windows.UI.ApplicationSettings.SettingsCommand("privacy", "Privacy Policy", GridDice.SettingsManager.showPrivacyPolicy);
                eventArgs.request.applicationCommands.append(settingsCommand);
            },

            resetAll: function () {
                GridDice.Utilities.showYesNoDialog("This will reset all high scores; continue?").then(function (result) {
                    if (result == "Yes") {
                        GridDice.HighScoreManager.resetAllScores();
                        GridDice.SavedGameManager.clearSavedGame();
                        GridDice.Utilities.showInfoBox("All high scores have been reset.");
                        WinJS.Navigation.navigate("/pages/home/home.html");
                    }
                });
            },

            showPrivacyPolicy: function () {
                var url = new Windows.Foundation.Uri("http://www.wanderlinggames.com/griddiceprivacy.html");
                Windows.System.Launcher.launchUriAsync(url);
            },
        }
    });

    // Initialize the static SettingsManager.
    // TODO (CLEANUP): better way to do this in js?
    GridDice.SettingsManager.initialize();
})();