(function () {
    "use strict";

    // Main play page
    WinJS.UI.Pages.define("/pages/play/play.html", {

        ready: function (element, options) {

            // Create the score manager model
            this.scoreManagerModel = new GridDice.ScoreManagerModel();

            // Create a gameboard model but don't initialize it until the GameBoardView is around to watch it.  This is what handles all game logic.
            this.gameBoardModel = new GridDice.GameBoardModel(this.scoreManagerModel);

            // Now create the view onto the gameboard model.  This is what we'll display on the screen
            this.gameBoardView = new GridDice.GameBoardView(this.gameBoardModel, $(".gameBoardDiv"));

            // Create the score manager view
            this.scoreManagerView = new GridDice.ScoreManagerView(this.scoreManagerModel, $(".scoreCategoriesDiv1"), $(".scoreCategoriesDiv2"));

            var resuming = GridDice.SavedGameManager.hasSavedGame();
            if (resuming) {

                // restore an existing game (TODO)
                this.gameBoardModel.initialize(5, 5);
                this.scoreManagerModel.initialize();
                GridDice.SavedGameManager.restoreGame(this.gameBoardModel, this.scoreManagerModel);
            } else {

                // Now initialize the gameboard model with a 5x5 board
                this.gameBoardModel.initialize(5, 5);

                // Populate the gameboard with random dice values
                this.gameBoardModel.populate();

                // Populate the score manager with zeros
                this.scoreManagerModel.initialize();

                GridDice.SavedGameManager.saveGame(this.gameBoardModel, this.scoreManagerModel);
            }

            // Hook up restart button
            var that = this;
            $("#restartCmd").show();
            $("#restartCmd").click(function () {
                
                GridDice.AudioMgr.play(GridDice.sounds.buttonClick);
                GridDice.Utilities.showYesNoDialog("Restart Game?").done(function (result) {
                    if (result == "Yes")
                        that.restartGame();
                });
            });

            // Hook up the 'return to main menu' button
            $("#mainMenuCmd").show();
            $("#mainMenuCmd").click(function () {
                GridDice.AudioMgr.play(GridDice.sounds.buttonClick);
                if (!that.scoreManagerModel.gameCompleted)
                    GridDice.SavedGameManager.saveGame(that.gameBoardModel, that.scoreManagerModel);
                appbar.winControl.hide();
                WinJS.Navigation.navigate("/pages/home/home.html");
            });

            // Listen for game completed events from the score manager
            this.scoreManagerModel.addEventListener("gameCompleted", this.gameCompleted.bind(this));

            // Hook up gameover-dialog buttons
            $("#restartGame").click(function () {
                GridDice.AudioMgr.play(GridDice.sounds.buttonClick);

                var slideEnd = -($(gameOverDialog).outerHeight() + 20);

                // TODO (CLEANUP): css("bottom") isn't working the way I expected in snapped view; likely because we're using css:scale
                //                 to make everything fit.  I haven't stumbled on the right way to make it work; this hack gets me past it.
                if (document.body.clientHeight != document.body.scrollHeight)
                    slideEnd = -390;

                GridDice.AudioMgr.play(GridDice.sounds.slideDown);
                $(gameOverDialog).animate({ "bottom": slideEnd + "px", "opacity": 0.5 }, 500, "easeInQuad", function () {
                    $(this).hide();
                    that.restartGame();
                });
            });

            var that = this;
            $("#gotoMainMenu").click(function () {
                GridDice.AudioMgr.play(GridDice.sounds.buttonClick);
                WinJS.Navigation.navigate("/pages/home/home.html");
            });

            // If the user starts a streak and then releases over something other than a Die, then we need to cancel the current
            // streak.  TODO (CLEANUP): This 'global' approach feels ugly; but doing a setCapture on the pressed die doesn't work since 
            // we need to track enter/leave on other dice as the pointer moves.  I could move all input handling 'up' from the DieViews
            // and into the GameBoardView; but that has ugliness issues as well.  Huh.
            $("body").on("mouseup", function (event) {

                if (!event.isDefaultPrevented()) {

                    // The user released the mouse/lifted their finger and it wasn't handled; cancel current streak (if any)
                    that.gameBoardModel.completeStreak();
                }
            });
        },

        // called when suspending
        oncheckpoint: function () {

            if (!this.scoreManagerModel.gameCompleted)
                GridDice.SavedGameManager.saveGame(this.gameBoardModel, this.scoreManagerModel);
        },

        updateLayout: function () {
            this.gameBoardView.updateLayout();
            this.scoreManagerView.updateLayout();

            if ($(gameOverDialog).css("display") == "block") {
                var slideStart = -($(gameOverDialog).outerHeight() + 10);
                if (document.body.clientHeight != document.body.scrollHeight)
                    slideStart = -390;
                var slideEnd = slideStart + $(gameOverDialog).outerHeight();

                $(gameOverDialog).css({ "bottom": slideEnd + "px", "opacity": 1 }).show();
            }
        },

        unload: function () {

            // in case user is going 'back', save state
            if (!this.scoreManagerModel.gameCompleted)
                GridDice.SavedGameManager.saveGame(this.gameBoardModel, this.scoreManagerModel);

            // Remove our appbar button click handlers
            $("#restartCmd").unbind("click");
            $("#mainMenuCmd").unbind("click");
        },

        gameCompleted: function () {

            // Clear out the saved game so we don't come back to it if the user suspends at this point.
            GridDice.SavedGameManager.clearSavedGame();

            // Set the text in the dialog
            $(gameOverScore).text(this.scoreManagerModel.totalScore);
            if (GridDice.HighScoreManager.lastScorePosition == -1)
                $(yourRank).text("Try again!");
            else
                $(yourRank).text("Rank: " + (GridDice.HighScoreManager.lastScorePosition + 1));

            // Shadow isn't accounted for in outerHeight; so add 10
            var slideStart = -($(gameOverDialog).outerHeight() + 10);

            // TODO (CLEANUP): css("bottom") isn't working the way I expected in snapped view; likely because we're using css:scale
            //                 to make everything fit.  I haven't stumbled on the right way to make it work; this hack gets me past it.
            if (document.body.clientHeight != document.body.scrollHeight)
                slideStart = -390;

            var slideEnd = slideStart + $(gameOverDialog).outerHeight();

            // Animate the dialog up from the bottom of the page.
            GridDice.AudioMgr.play(GridDice.sounds.slideUp);
            $(gameOverDialog).css({ "bottom": slideStart + "px", "opacity": 1 }).show().animate({ "bottom": slideEnd + "px" }, 750, "easeOutQuad");
        },

        restartGame: function () {
            GridDice.SavedGameManager.clearSavedGame();
            this.scoreManagerModel.restartGame();
            this.gameBoardModel.restartGame();
            GridDice.SavedGameManager.saveGame(this.gameBoardModel, this.scoreManagerModel);
        }
    });
})();
