var SkiConqueror = (function ($) {
    var SkiConqueror = function(el, settings) {
        var that = this;

        function init(el, settings) {
            that.$el = $(el);
            that.settings = settings;
            that.result = [];
            that.landscape = [];

            that.reset();
            that.generateLandscape();
            that.drawMap();
        }


        init(el, settings);
    };

    SkiConqueror.prototype.reset = function() {
        // clean up container
        this.$el.find("*").off();
        this.$el.empty();
    };

    SkiConqueror.prototype.generateLandscape = function() {
        // create landscape based on settings
        var that = this;

        function getRandomAltitude() {
            return Math.floor(Math.random() * (that.settings.max - that.settings.min + 1)) + that.settings.min;
        }

        for( var y = 0; y < this.settings.vertical; y++ ) {
            this.landscape[y] = [];
            for( var x = 0; x < this.settings.horizontal; x++ ) {
                this.landscape[y].push(getRandomAltitude());
            }
        }
    };

    SkiConqueror.prototype.drawMap = function() {
        // draw the map based on landscape generated
        var that = this;
        var table = $("<table class='ski-conqueror'></table>");

        this.landscape.forEach(function(items, y){
            var tr = $("<tr></tr>");
            items.forEach(function(altitude, x){
                var td = $("<td class='"+ x + "-" + y +"'>" + altitude + "</td>");
                tr.append(td);
            });
            table.append(tr);
        });

        that.$el.append(table);
    };

    SkiConqueror.prototype.compute = function() {
        // do the awesome stuff here!
    };

    return SkiConqueror;

})(jQuery);