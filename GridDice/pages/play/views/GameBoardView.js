"use strict";

WinJS.Namespace.define("GridDice", {

    // GameBoard object definition
    GameBoardView: WinJS.Class.define(

        // GameBoardView Constructor
        function (gameBoardModel, $displayDiv) {

            // Keep track of the model which we are displaying
            this.model = gameBoardModel;

            // Keep track of the div to which we will render ourself and our cards
            this.$displayDiv = $displayDiv;

            // Watch for changes to the gameboard model (e.g. cards added/removed)
            this.model.addEventListener("dieAdded", this.dieAdded.bind(this));
        },

        // GameBoardView class instance members
        {
            updateLayout: function () {
                // nothing to do here.
            },

            dieAdded: function (eventInfo) {

                // Create the DieView for the new DieModel
                var DieView = new GridDice.DieView(eventInfo.detail.card, this.$displayDiv);

                // thisDieViews.push(DieView);
            },

            model: null
        })
});