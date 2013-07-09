(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData;
    var localSettings = appData.current.localSettings.values;
    WinJS.Namespace.define("GridDice", {

        // HighScoreManager object definition
        HighScoreManager: {

            initialize: function () {
                // Load existing high scores (if any) from the datastore
                if (localSettings.hasKey("highScores"))
                    this.highScores = JSON.parse(localSettings["highScores"]);
                else {
                    this.resetAllScores();
                }
                this.resetAllScores();
            },

            logScore: function (score, name) {

                var newScore = { score: score, name: name };

                // Add score to the highScores table (clipped to 100 scores)
                this.highScores.push(newScore);
                this.highScores.sort(function (a, b) { return b.score-a.score });

                // limit to top 20 scores
                this.highScores = this.highScores.slice(0, 20);

                // Store the position of the logged store so that it can be displayed elsewhere
                this.lastScorePosition = this.highScores.indexOf(newScore);

                this.persistScores();
            },

            persistScores: function () {
                // Yes, I'm cheating by using localSettings instead of localStorage.
                localSettings["highScores"] = JSON.stringify(this.highScores, null, 2);
            },

            resetAllScores: function () {
                this.highScores = [{ score: 330, name: "Jacob" },
                                   { score: 321, name: "Luke" },
                                   { score: 274, name: "Jenn" },
                                   { score: 215, name: "Sarah" },
                                   { score: 202, name: "Kurt" },
                                   { score: 170, name: "Betty" },
                                   { score: 148, name: "Dan" },
                                   { score: 133, name: "Mark" },
                                   { score: 117, name: "Melissa" },
                                   { score: 11, name: "Jeff" }]
                this.persistScores();
            },

            highScores: []
        }
    });

    // Initialize the static HighScoreManager.
    GridDice.HighScoreManager.initialize();
})();
