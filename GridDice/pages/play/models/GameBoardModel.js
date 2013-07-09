"use strict";

WinJS.Namespace.define("GridDice", {

    // GameBoard object definition
    GameBoardModel: WinJS.Class.define(

        // GameBoard Constructor
        function (scoreManagerModel) {
            this.scoreManagerModel = scoreManagerModel;

            this.scoreManagerModel.addEventListener("streakApplied", this.streakApplied.bind(this));
        },

        // GameBoard class instance members
        {
            initialize: function (width, height) {

                // Keep track of our size
                this.width = width;
                this.height = height;

                this.initializeBoard();
            },

            initializeBoard: function () {

                this.inStreak = false;
                this.exitedDice = null;

                // Create the two dimensional array of dice that are displayed on the table.
                // TODO (CLEANUP): Better way to deal with multidimensional arrays in Javascript?
                this.dice = [];
                for (var y = 0; y < this.height; y++) {
                    this.dice[y] = [];
                    for (var x = 0; x < this.width; x++) {

                        this.dice[y][x] = new GridDice.DieModel(this, x, y);

                        // trigger a card added event for any models that are listening for changes to this model
                        this.dispatchEvent("dieAdded", { card: this.dice[y][x] });
                    }
                }
            },

            restoreGame: function (saveData) {
                for (var y = 0; y < this.height; y++)
                    for (var x = 0; x < this.width; x++)
                        this.dice[y][x].setTo(saveData.faces[y][x]);
            },

            saveGame: function (saveData) {
                saveData.faces = [];
                for (var y = 0; y < this.height; y++) {
                    saveData.faces[y] = [];
                    for (var x = 0; x < this.width; x++)
                        saveData.faces[y][x] = this.dice[y][x].face;
                }
            },

            restartGame: function () {
                
                for (var y = 0; y < this.height; y++)
                    for (var x = 0; x < this.width; x++)
                        this.dice[y][x].removeFromBoard({ doAnim: false });
                this.streakDice = [];
                this.initializeBoard();
                this.populate();
            },

            populate: function () {

                // Pick (width x height) dice from the draw pile and place them in the gameboard
                for (var y = 0; y < this.height; y++)
                    for (var x = 0; x < this.width; x++) {

                        var dieFace = Math.floor(Math.random() * 6) + 1;
                        this.dice[y][x].setTo(dieFace);
                    }
            },


            // Called when the user starts a new streak (e.g. by pressing on a card)
            cursorPressedOverDie: function (startCard) {

                if (this.scoreManagerModel.gameCompleted)
                    return;

                this.clearStreak();
                this.exitedDice = null;
                this.inStreak = true;
                this.addCardToStreak(startCard);

                // tell the scoremanager to clear the catgories
                this.scoreManagerModel.streakStarted();
            },


            // If the user releases the pointer, then complete the streak
            cursorReleasedOverDie: function (card) {

                if (!this.inStreak)
                    return;

                this.completeStreak();
            },

            cursorEnteredDie: function (card) {

                if (!this.inStreak)
                    return;

                // if this card is already in the streak then ignore it
                var cardPosition = this.streakDice.indexOf(card);
                if (cardPosition != -1) {

                    // While we're here: if we just exited a card that is in the streak and we are the top card the streak, then remove the card that we exited
                    if (this.exitedDice && cardPosition == this.streakDice.length - 2 && this.streakDice.indexOf(this.exitedDice) == this.streakDice.length - 1) {
                        this.exitedDice.removeFromStreak();
                        this.streakDice.pop();
                        this.exitedDice = null;
                    }
                    return;
                }

                // The entered card must be 1 away (nondiagonally) from the last card in the streak
                if (this.streakDice.length > 0) {

                    var topStreakCard = this.streakDice[this.streakDice.length - 1];
                    if (!((topStreakCard.y == card.y && Math.abs(topStreakCard.x - card.x) == 1) ||
                        (topStreakCard.x == card.x && Math.abs(topStreakCard.y - card.y) == 1)))
                        return;
                }

                // If we already have 5 card in the streak, then ignore this card
                if (this.streakDice.length == 5)
                    return;

                this.addCardToStreak(card);
            },

            cursorExitedDie: function (card) {

                // If the user has exited the card and entered a card which is *already* in the streak, then remove the just-exited card from the streak
                if (!this.inStreak)
                    return;
                this.exitedDice = card;
            },


            addCardToStreak: function (card) {
                this.streakDice.push(card);
                card.addToStreak();
            },

            continueStreak: function (card) {

                // todo: if dragging over last card in streak then remove it
                if (this.streakDice.length == 5)
                    return;
                this.addCardToStrek(card);
            },

            completeStreak: function () {

                if (this.streakDice.length == 5) {
                    // A streak was successfully completed; highlight the score categories which are playable and let the user click one.
                    this.scoreManagerModel.streakCompleted(this.streakDice);

                } else {
                    // A streak was cancelled
                    this.clearStreak();
                }
                this.inStreak = false;
            },

            clearStreak: function () {
                this.streakDice.forEach(function (dieModel) {
                    dieModel.removeFromStreak();
                });
                this.inStreak = false;
                this.streakDice = [];
            },

            streakApplied: function () {

                // The player applied the current streak to one of the score categories
                // Move all dice *above* the streak dice down one
                // note: do y from bottom to top so that we don't stomp on ourselves as we shift dice down.
                for (var y = this.height - 1; y >= 0; y--) {
                    for (var x = 0; x < this.width; x++) {

                        // The die to shift
                        var dieToShift = this.dice[y][x];

                        // don't shift streak dice
                        if (this.streakDice.indexOf(dieToShift) != -1)
                            continue;

                        // count how many streak dice are underneath dieToShift; shift dieToShift down by that many

                        var slotsToShiftDown = 0;
                        this.streakDice.forEach(function (streakDie) {
                            if (streakDie.x == dieToShift.x && streakDie.y > dieToShift.y)
                                slotsToShiftDown++;
                        });
                        if (slotsToShiftDown > 0) {
                            dieToShift.shiftDown(slotsToShiftDown);
                            this.dice[dieToShift.y][dieToShift.x] = dieToShift;
                        }
                    }
                }

                // Create 5 new dice and add them to the board above where the streak dice are.
                for (var x = 0; x < this.width; x++) {
                    var dieToAddToColumn = 0;
                    this.streakDice.forEach(function (dieModel) {
                        if (dieModel.x == x)
                            dieToAddToColumn++;
                    });

                    for (var i = 0; i < dieToAddToColumn; i++) {
                        var newDieFace = Math.floor(Math.random() * 6) + 1;
                        this.dice[i][x] = new GridDice.DieModel(this, x, i);
                        this.dispatchEvent("dieAdded", { card: this.dice[i][x] });
                        this.dice[i][x].setTo(newDieFace);
                        this.dice[i][x].slideInFrom(-dieToAddToColumn);
                    }
                }

                GridDice.AudioMgr.play(GridDice.sounds.tilesRemoved);

                // Remove the streak dice from the board
                for (var i = 0; i < this.streakDice.length; i++)
                    this.streakDice[i].removeFromBoard({ doAnim: true, index: i });

                this.streakDice = [];
            },

            streakDice: []
        })
});

WinJS.Class.mix(GridDice.GameBoardModel, WinJS.Utilities.eventMixin);
