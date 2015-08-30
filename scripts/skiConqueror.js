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
            setTimeout(function(){
                that.compute();
            }, 100)
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
        var that = this;

        var movement = [
            //x,y,name
            [0, -1, 'u'],
            [0, 1, 'd'],
            [1, 0, 'r'],
            [-1, 0, 'l']
        ];

        function getDelta(arr) {
            if( !arr.length ) {
                return 0;
            }

            var first = arr[0];
            var last = arr[arr.length-1] || first;

            return that.landscape[first[1]][first[0]] - that.landscape[last[1]][last[0]];
        }

        function checkResult(pathList) {
            if( pathList.length < that.result.length ) {
                // not a longer path so far
                return;
            }

            if(pathList.length === that.result.length) {
                var pathDelta = getDelta(pathList);
                var resultDelta = getDelta(that.result);

                if( pathDelta > resultDelta ) {
                    // higher delta of altitude
                    console.log("New higher delta", JSON.stringify(pathList));
                    that.result = $.extend(true, [], pathList);
                }
            }
            else {
                // longer path
                console.log("New longer path", JSON.stringify(pathList));
                that.result = $.extend(true, [], pathList);
            }
        }

        function run(x, y, prevAltitude, pathList, pathDict) {
            pathDict[x + "-" + y] = true;

            movement.forEach(function(m){
                var newX = x + m[0];
                var newY = y + m[1];
                var newDirection = m[2];


                if( pathDict[newX + "-" + newY] ) {
                    // been there, go back
                    checkResult(pathList);
                    return;
                }

                if( newX < 0 || newY < 0 || newX >= that.settings.horizontal || newY >= that.settings.vertical ) {
                    // dead end, go back
                    checkResult(pathList);
                    return;
                }

                var newAltitude = that.landscape[newY][newX];

                if( newAltitude >= prevAltitude ) {
                    // can't slide up, go back
                    checkResult(pathList);
                    return;
                }

                pathList[pathList.length-1][2] = newDirection;
                run(newX, newY, newAltitude, pathList.concat([[newX, newY, '', newAltitude]]), pathDict);


            });

            delete(pathDict[x + "-" + y]);
        }

        console.time("Computing " + this.settings.horizontal + "x" + this.settings.vertical);
        for( var y = 0; y < this.settings.vertical; y ++ ) {
            for( var x = 0; x < this.settings.horizontal; x ++ ) {
                run(x, y, that.landscape[y][x], [[x, y, '', that.landscape[y][x]]], {});
            }
        }
        console.timeEnd("Computing " + this.settings.horizontal + "x" + this.settings.vertical);

        console.log("FINAL RESULTS", JSON.stringify(that.result));
        that.result.forEach(function(item, index){
            that.$el.find('td.' + item[0]+ '-' + item[1]).addClass(item[2]);
            if( index === 0 ) {
                that.$el.find('td.' + item[0]+ '-' + item[1]).addClass("start");
            }
            else if( index === that.result.length - 1) {
                that.$el.find('td.' + item[0]+ '-' + item[1]).addClass("end");
            }
        });
    };

    return SkiConqueror;

})(jQuery);