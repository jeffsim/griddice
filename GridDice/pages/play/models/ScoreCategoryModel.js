"use strict";

WinJS.Namespace.define("GridDice", {

    ScoreCategoryModel: WinJS.Class.define(
        function (scoreManagerModel, name, scoreFunction, scoreData) {
            this.scoreManagerModel = scoreManagerModel;
            this.scoreFunction = scoreFunction;
            this.scoreData = scoreData;
            this.name = name;
            this.played = false;
            this.faces = [];
            this.score = 0;
            this.dispatchEvent("allChanged");
        },
        {
            // called by the controller; todo: is there a cleaner way to connect this up?
            selected: function () {
                this.scoreManagerModel.scoreCategorySelected(this);
            },

            restoreGame: function (saveData) {

                this.score = saveData.score;
                this.played = saveData.played;
                this.faces = saveData.faces.slice(0);
                this.setCurrentStreakValue(null);
                this.dispatchEvent("allChanged");
            },

            saveGame: function (saveData) {
                saveData.score = this.score;
                saveData.played = this.played;
                saveData.faces = this.faces.slice(0);
            },

            restartGame: function() {
                this.score = 0;
                this.played = false;
                this.faces = [];
                this.setCurrentStreakValue(null);
                this.dispatchEvent("allChanged");
            },

            setPlayed: function (dice) {
                this.faces = this.getFaces(dice);
                this.played = true;
                this.score = this.scoreFunction(this.faces, this.scoreData);
                this.dispatchEvent("allChanged");
            },

            clearCurrentStreakValue: function () {
                this.setCurrentStreakValue(null);
            },

            setCurrentStreakValue: function (dice) {
                this.currentStreakValue = dice ? this.scoreFunction(this.getFaces(dice), this.scoreData) : undefined;
                this.dispatchEvent("currentStreakValueChanged");
            },

            setStreakScore: function (dice) {
                this.score = dice ? this.scoreFunction(this.getFaces(dice), this.scoreData) : 0;
                this.dispatchEvent("scoreChanged");
            },

            getFaces: function (dice) {
                var faces = [];
                if (dice) {
                    dice.forEach(function (die) {
                        faces.push(die.face);
                    });
                }
                return faces;
            }
        })
});

WinJS.Class.mix(GridDice.ScoreCategoryModel, WinJS.Utilities.eventMixin);
