"use strict";

WinJS.Namespace.define("GridDice", {

    // ScoreManagerModel object definition
    ScoreManagerModel: WinJS.Class.define(

        // ScoreManagerModel Constructor
        function () {

            this.scoreCategories = [];
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Ones", this.scalarScoreFunction.bind(this), 1));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Twos", this.scalarScoreFunction.bind(this), 2));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Threes", this.scalarScoreFunction.bind(this), 3));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Fours", this.scalarScoreFunction.bind(this), 4));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Fives", this.scalarScoreFunction.bind(this), 5));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Sixes", this.scalarScoreFunction.bind(this), 6));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Chance", this.chanceScoreFunction.bind(this)));

            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Three of a Kind", this.ofAKindScoreFunction.bind(this), 3));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Four of a Kind", this.ofAKindScoreFunction.bind(this), 4));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Full House", this.fullHouseScoreFunction.bind(this)));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Small Straight", this.straightScoreFunction.bind(this), 4));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Large Straight", this.straightScoreFunction.bind(this), 5));
            this.scoreCategories.push(new GridDice.ScoreCategoryModel(this, "Five of a Kind", this.ofAKindScoreFunction.bind(this), 5));

            this.streakReadyToApplyToCategory = false;
            this.gameCompleted = false;
        },

        // ScoreManagerModel class instance members

        {
            restoreGame: function (saveData) {
                this.totalScore = saveData.totalScore;
                this.dispatchEvent("totalScoreChanged");
                this.haveGivenBonus = saveData.haveGivenBonus;
                this.gameCompleted = saveData.gameCompleted;
                this.totalBonusValue = saveData.totalBonusValue;
                for (var i = 0; i < this.scoreCategories.length; i++)
                    this.scoreCategories[i].restoreGame(saveData.scoreCategories[i]);
                this.dispatchEvent("gameRestarted");
            },

            saveGame: function (saveData) {
                saveData.totalScore = this.totalScore;
                saveData.haveGivenBonus = this.haveGivenBonus;
                saveData.gameCompleted = this.gameCompleted;
                saveData.totalBonusValue = this.totalBonusValue;
                saveData.scoreCategories = [];
                for (var i = 0; i < this.scoreCategories.length; i++) {
                    saveData.scoreCategories[i] = {};
                    this.scoreCategories[i].saveGame(saveData.scoreCategories[i]);
                }
            },

            restartGame: function () {

                this.totalScore = 0;
                this.dispatchEvent("totalScoreChanged");
                this.haveGivenBonus = false;
                this.gameCompleted = false;
                this.totalBonusValue = 0;
                this.scoreCategories.forEach(function (scoreCategory) {
                    scoreCategory.restartGame();
                });
                this.dispatchEvent("gameRestarted");
            },

            scalarScoreFunction: function (faces, value) {
                // Calculate score
                var result = 0;
                for (var i in faces)
                    if (faces[i] == value)
                        result += value;
                return result;
            },

            chanceScoreFunction: function (faces, value) {
                // Calculate score
                return this.addDiceFaces(faces);
            },

            ofAKindScoreFunction: function (faces, value) {
                // Calculate score
                faces = faces.sort(function (a, b) { return a - b; });
                if (value == 5 && faces[0] == faces[4])
                    return 50;  // five of a kind always worth 50

                if (value == 4) {
                    if (faces[0] == faces[1] && faces[1] == faces[2] && faces[2] == faces[3])
                        return this.addDiceFaces(faces);
                    if (faces[1] == faces[2] && faces[2] == faces[3] && faces[3] == faces[4])
                        return this.addDiceFaces(faces);
                }
                if (value == 3) {
                    if (faces[0] == faces[1] && faces[1] == faces[2])
                        return this.addDiceFaces(faces);
                    if (faces[1] == faces[2] && faces[2] == faces[3])
                        return this.addDiceFaces(faces);
                    if (faces[2] == faces[3] && faces[3] == faces[4])
                        return this.addDiceFaces(faces);
                }
                return 0;
            },

            fullHouseScoreFunction: function (faces, value) {

                faces = faces.sort(function (a, b) { return a - b; });
                if (faces[0] == faces[1] && faces[2] == faces[3] && faces[3] == faces[4] ||
                    faces[0] == faces[1] && faces[1] == faces[2] && faces[3] == faces[4]) {
                    if (faces[0] != faces[4])   // five of a kind != full house
                        return 25;  // full house always worth 25
                }
                return 0;
            },


            straightScoreFunction: function (faces, value) {
                // sort the dice, then see if there's a sequence of 'value' length
                faces = faces.sort(function (a, b) { return a - b; });
                if (value == 5 && faces[0] == faces[1] - 1 && faces[1] == faces[2] - 1 && faces[2] == faces[3] - 1 && faces[3] == faces[4] - 1)
                    return 40;  // large straight always worth 40

                // remove duplicates
                var faces2 = [];
                faces.forEach(function (face) {
                    if (faces2.indexOf(face) == -1)
                        faces2.push(face);
                });
                faces = faces2;
                if (value == 4 && faces.length >= 4) {
                    var result = 0;
                    // small straight starting at first die
                    if (faces[0] == faces[1] - 1 && faces[1] == faces[2] - 1 && faces[2] == faces[3] - 1)
                        result = 30;// small straight always worth 30

                    // small straight starting at second die
                    if (faces[1] == faces[2] - 1 && faces[2] == faces[3] - 1 && faces[3] == faces[4] - 1)
                        result = 30;// small straight always worth 30
                    return result;  
                }
                return 0;
            },

            addDiceFaces: function (faces) {
                var result = 0;
                for (var i in faces)
                    result += faces[i];
                return result;
            },

            initialize: function () {

                this.totalBonusValue = 0;
                this.totalScore = 0;
                this.haveGivenBonus = false;
                this.dispatchEvent("totalScoreChanged");
                this.dispatchEvent("categoriesCreated");
            },

            streakStarted: function () {

                // clear all highlights
                this.streakReadyToApplyToCategory = false;

                this.scoreCategories.forEach(function (scoreCategory) {
                    if (!scoreCategory.played)
                        scoreCategory.clearCurrentStreakValue();
                });
            },

            streakCompleted: function (dice) {

                // Highlight the non-completed score categories which can be played with the specified dice.
                this.streakReadyToApplyToCategory = true;
                this.streakDice = dice.slice(0);

                // update the score that would be applied to all unplayed categories 
                var that = this;
                this.scoreCategories.forEach(function (scoreCategory) {
                    if (!scoreCategory.played)
                        scoreCategory.setCurrentStreakValue(that.streakDice);
                    //scoreCategory.setStreakScore(dice);
                });
            },

            updateBonus: function (justFilledScoreCategory) {

                // if this is one of the 1-6 score categories, then update the bonus ("cur/63") display
                if (this.scoreCategories.indexOf(justFilledScoreCategory) <= 5) {

                    this.totalBonusValue += justFilledScoreCategory.score;
                    this.dispatchEvent("bonusChanged");

                    // If this was the *last* of the 1-6 score categories to be filled, then check if bonus score should be added
                    if (!this.haveGivenBonus) {
                        var totalValue = 0;
                        for (var i = 0; i <= 5; i++)
                            totalValue += this.scoreCategories[i].score;
                        if (totalValue >= 63) {
                            GridDice.AudioMgr.play(GridDice.sounds.bonusAwarded);
                            this.haveGivenBonus = true;
                            this.dispatchEvent("bonusAwarded");
                            this.totalScore += 35;
                            this.dispatchEvent("scoreChanged");
                        }
                    }
                }
            },

            scoreCategorySelected: function (scoreCategory) {

                if (!this.streakReadyToApplyToCategory)
                    return;

                if (scoreCategory.played)
                    return;

                GridDice.AudioMgr.play(GridDice.sounds.scoreCategoryClicked);
                
                scoreCategory.setPlayed(this.streakDice);
                this.streakReadyToApplyToCategory = false;

                this.updateBonus(scoreCategory);
                this.totalScore += scoreCategory.score;
                this.dispatchEvent("totalScoreChanged");

                this.scoreCategories.forEach(function (scoreCategory) {
                    if (!scoreCategory.played)
                        scoreCategory.setStreakScore(null);
                });
                this.dispatchEvent("streakApplied");

                // Are *all* Score Categories filled?  If so, the game is over
                var allCategoriesCompleted = true;
                this.scoreCategories.forEach(function (scoreCategory) {
                    allCategoriesCompleted &= scoreCategory.played;
                });

//allCategoriesCompleted = true;
                if (allCategoriesCompleted) {

                    // Mark that the game has been completed
                    this.gameCompleted = true;

                    // Log the score.  Get the player's name first
                    var that = this;
                    var playerName = Windows.System.UserProfile.UserInformation.getDisplayNameAsync().done(function (playerName) {

                        // if the user disallowed acquiring the username, then just set it to player
                        if (!playerName || playerName == "")
                            playerName = "Player";

                        // Store the score
                        GridDice.HighScoreManager.logScore(that.totalScore, playerName);

                        // Notify any listeners that the game has been completed.
                        that.dispatchEvent("gameCompleted");
                    });
                }
            }
        })
});

WinJS.Class.mix(GridDice.ScoreManagerModel, WinJS.Utilities.eventMixin);
