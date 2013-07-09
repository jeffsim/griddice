(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            
            $("#mainMenuCmd").hide();
            $("#restartCmd").hide();

            $(".startButton").live("click", function () {
                GridDice.AudioMgr.play(GridDice.sounds.buttonClick);
                WinJS.Navigation.navigate("/pages/play/play.html");
            });

            if (GridDice.SavedGameManager.hasSavedGame())
                $(".startButton").text("Continue game");
            else 
                $(".startButton").text("Start game");

            // Define the listview's groups
            this.listGroups = [
				{ key: "1welcome", title: "Play Grid Dice" },
				{ key: "2scores", title: "High Scores" },
				{ key: "3howtoplay", title: "How to play" }
            ];

            // Populate the list of scores and stuff
            var list = this.populateList();

            // Create a grouped projection for our listview.
            var groupedItems = list.createGrouped(
				function groupKeySelector(item) { return item.group.key; },
				function groupDataSelector(item) { return item.group; }
			);

            // Enable cell spanning for the larger "Welcome" list item
            function groupInfo() {
                return {
                    enableCellSpanning: true,
                    cellWidth: 280,
                    cellHeight: 45
                };
            }

            // Initialize the listview
            var listView = element.querySelector(".homePagelist").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headerTemplate");
            listView.layout = new WinJS.UI.GridLayout({ groupInfo: groupInfo, groupHeaderPosition: "top" });
            listView.itemTemplate = GridDice.Utilities.templateSelector;
            listView.itemDataSource = groupedItems.dataSource;
            listView.groupDataSource = groupedItems.groups.dataSource;
        },

        unload: function() {
            $(".startButton").die("click");
        },


        // ================================================================
        //
        // homePage.populateList
        //
        //		Populates the list of templates and samples
        //
        populateList: function () {
            var list = new WinJS.Binding.List();

            // Add the welcome list item
            list.push({
                group: this.listGroups[0],
                itemTemplate: 'welcomeTemplate'
            });

            var that = this;
            var scores = GridDice.HighScoreManager.highScores;
            for (var i = 0; i < scores.length; i++) {
                var name = i < 9 ? scores[i].name : "&nbsp;&nbsp;" + scores[i].name;
                list.push({
                    group: that.listGroups[1],
                    itemTemplate: 'scoreTemplate',
                    rank: (i+1) + ":", 
                    name: name,
                    score: scores[i].score
                });
            }

            // Add the how to play list item
            list.push({
                group: this.listGroups[2],
                itemTemplate: 'howToPlayTemplate'
            });
            return list;
        }
    });
})();
