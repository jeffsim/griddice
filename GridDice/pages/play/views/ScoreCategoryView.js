"use strict";

WinJS.Namespace.define("GridDice", {

    // ScoreCategoryView object definition
    ScoreCategoryView: WinJS.Class.define(

        // ScoreCategoryView constructor
        function (scoreCategoryModel, $scoreManagerDiv, x, y) {

            // Keep track of the model which we are displaying
            this.model = scoreCategoryModel;

            this.x = x;
            this.y = y;

            this.$scoreManagerDiv = $scoreManagerDiv;

            // Listen for changes to our ScoreCategoryModel
            this.model.addEventListener("allChanged", this.initializeVisual.bind(this));
            this.model.addEventListener("scoreChanged", this.scoreChanged.bind(this));
            this.model.addEventListener("currentStreakValueChanged", this.currentStreakValueChanged.bind(this));

            this.initializeVisual();
        },

        // ScoreCategoryView instance members

        {
            currentStreakValueChanged: function (eventInfo) {
                if (this.model.currentStreakValue)
                    $(".scoreValue", this.$visual).text(this.model.currentStreakValue);
                else
                    $(".scoreValue", this.$visual).text(this.model.score);
            },

            scoreChanged: function (eventInfo) {
                $(".scoreValue", this.$visual).text(this.model.score);
            },

            initializeVisual: function () {

                if (this.$visual)
                    this.$visual.remove();
                    
                // Create our visual using the 'scoreCategoryTemplate' template
                var $scoreDiv = $(".scoreCategoryTemplate").clone(true);
                var that = this;
                var dy = window.outerWidth >= 1024 ? 78 : 70;

                WinJS.Binding.processAll($scoreDiv[0], this.model).then(function () {

                    // Populate this score's visual with the template that we just bound to this score's model
                    that.$visual = $scoreDiv.contents();

                    // Add the score's visual to the gameboard and place it
                    that.$visual.css("left", (that.x * 65 + 5) + "px");
                    that.$visual.css("top", (that.y * dy + 5) + "px");
                    that.$scoreManagerDiv.append(that.$visual);

                    // Initialize input handlers; pass events on to our model
                    // NOTE: For simplicity, we're just doing MV here instead of MVC.

                    that.$visual.on("mousedown", function (event) {

                        // We need to prevent the default event so that we can drag across cards
                        event.preventDefault();

                        // inform our model that we were pressed
                        that.model.selected();
                    });

                });
            },

            updateLayout: function () {
                if (this.$visual) {
                    var dy = window.outerWidth >= 1024 ? 78 : 70;
                    this.$visual.css("left", (this.x * 65 + 5) + "px");
                    this.$visual.css("top", (this.y * dy + 5) + "px");
                }
            },

            model: null
        })
});

// 
WinJS.Namespace.define("GridDice", {
    
    ScoreCategoryBackgroundImageConverter: WinJS.Binding.converter(function (played) {

        return played ? "url(/images/categoryPlayed.png)" : "url(/images/categoryUnplayed.png)";
    }),
    
    DieDisplayConverter: WinJS.Binding.converter(function (faces) {

        if (faces.length == 0) {

            var str = "";
            for (var i = 0; i < 5; i++) {
                str += toStaticHTML("<div style='background-image: url(/images/tinyDice.png); " +
                                    "width:20px;height:20px; margin-right:4px;float:left;background-position:" +
                                    "-120px 0px'></div>");
            }
        } else {
            var str = "";
            for (var i = 0; i < faces.length; i++) {
                str += toStaticHTML("<div style='background-image: url(/images/tinyDice.png); " +
                                    "width:20px;height:20px; margin-right:4px;float:left;background-position:" +
                                    (-20 * (faces[i] - 1)) + "px 0px'></div>");
            }
        }
        return str;
    })
});