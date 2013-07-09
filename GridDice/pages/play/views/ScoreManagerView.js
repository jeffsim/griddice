"use strict";

WinJS.Namespace.define("GridDice", {

    // ScoreManagerView object definition
    ScoreManagerView: WinJS.Class.define(

        // ScoreManagerView Constructor
        function (scoreManagerModel, $categoryDiv1, $categoryDiv2) {

            // Keep track of the model which we are displaying
            this.model = scoreManagerModel;

            // Keep track of the div to which we will render ourself and our cards
            this.$categoryDiv1 = $categoryDiv1;
            this.$categoryDiv2 = $categoryDiv2;

            // Watch for changes to the scoreManager model (e.g. score categories changed)
            this.model.addEventListener("categoriesCreated", this.categoriesCreated.bind(this));
            this.model.addEventListener("totalScoreChanged", this.totalScoreChanged.bind(this));
            this.model.addEventListener("bonusChanged", this.bonusChanged.bind(this));
            this.model.addEventListener("bonusAwarded", this.bonusAwarded.bind(this));
            this.model.addEventListener("gameRestarted", this.gameRestarted.bind(this));
        },

        // ScoreManagerView class instance members
        {
            updateLayout: function () {
                // relayout all score categories
                this.scoreCategories.forEach(function(scoreCategory) {
                    scoreCategory.updateLayout();
                });
            },

            categoriesCreated: function (eventInfo) {

                this.scoreCategories = [];
                // Create the ScoreCategoryView for the new ScoreCategoryModels
                var that = this;
                var y = 0;
                this.model.scoreCategories.forEach(function (scoreCategory) {
                    
                    var scoreCategoryView = new GridDice.ScoreCategoryView(scoreCategory, y < 6 ? that.$categoryDiv1 : that.$categoryDiv2, 0, (y % 7));
                    that.scoreCategories.push(scoreCategoryView);
                    y ++;
                });
            },
            gameRestarted: function () {
                $(".bonusScore").css("color", "white");
                this.bonusChanged();
            },

            bonusChanged: function () {
                $(".bonusValue").text(this.model.totalBonusValue + "/63");
            },

            bonusAwarded: function () {
                $(".bonusScore").css("color", "yellow");
            },

            totalScoreChanged: function () {
                $(".totalScore").text("Score: " + this.model.totalScore);
            },

            model: null
        })
});