//$(function() {

//main visualisation global variables.
var mainchart = null;
var maindata = null;
var mainfocus = false;

var leftVis = null;
var middleVis = null;
var rightVis = null;
window.onload = function (e) {
    //removeGraph('main',mainVis);
    nv.log('loaded');
    drawmain(mainfocus, true, true);
    //jsonWait();

};


function drawmain(focus, interactive, tooltips) {
    d3.json("/vis/main_data/", function (error, data) {
        removeGraph('main',mainchart);
        nv.addGraph(function () {
            var chart;
            var tickformat = '.2f';
            if (focus) {
                chart = nv.models.lineWithFocusChart().margin({left: 60});
                chart.y2Axis.tickFormat(d3.format(tickformat));
                //chart.useInteractiveGuideline(interactive);
            } else {
                chart = nv.models.lineChart().margin({left: 60});
                chart.useInteractiveGuideline(interactive);
            }
            //chart.interpolate("step");
            //chart.title('Historic Data Visualisation').titleOffset(-10);
            //console.log('Main width: '+parseInt(d3.select('#main').style('width'))+' height: '+parseInt(d3.select('#main').style('height')));
            //chart.width(parseInt(d3.select('#main').style('width')));
            //chart.height(parseInt(d3.select('#main').style('height')));
            chart.xAxis.axisLabel('Years');
            chart.xAxis
                .tickFormat(d3.format('f'));
            chart.yAxis
                .tickFormat(d3.format(tickformat));
            chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(-10);
            chart.clipEdge(true);
            chart.y(function (d) {
                if(d.y=="") return null;
                return parseFloat(d.y)
            });
            chart.x(function (d) {
                return parseFloat(d.x)
            });
            chart.tooltips(tooltips);
            chart.tooltipContent(function(key, x, y, e, graph) {
            return '<h3>' + key + '</h3>' +
                '<p>' +  y + ' in ' + x + '</p>'
        });
            console.log('drawing main, interactive tooltip: ' + interactive + ' tooltip:' + tooltips);
            d3.select('#main svg')
                .datum(data)
                .transition()//.duration(300)
                .call(chart);
            nv.utils.windowResize(chart.update);
            mainchart = chart;
            maindata = data;
            /*chart.dispatch.on('elementMousemove', function(e){
                console.log('element: ');
                //console.dir(e.point);
            });*/

            /*Events Handlers*/
            if(chart.interactiveLayer != null){
                chart.interactiveLayer.dispatch.on('elementMousemove.mainphillips', function(e) {
                    if(leftVis!=null)leftVis.lines.clearHighlights();
                    //pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
                    //console.log(e.point+'  '+'   '+ e.pointXValue+'   '+ e.target);
                    var inflationSeries;
                    var unemploymentSeries;
                    data.forEach(function(series, i){
                        if(!series.key.indexOf('Inflation'))inflationSeries=series.values;
                        if(!series.key.indexOf('Unemployment'))unemploymentSeries=series.values;
                    });
                    //console.log(Math.round(e.pointXValue)+'    |'+inflationSeries[100].y+'|');
                    var inflation = inflationSeries[Math.round(e.pointXValue)-inflationSeries[0].x].y;
                    var unemployment = unemploymentSeries[Math.round(e.pointXValue)-unemploymentSeries[0].x].y;
                    //console.log('inflation: '+inflation+ ' unemployment: '+unemployment);
                    if(leftVis!=null)leftVis.lines.highlightPoint(0,parseInt(unemployment),true);
                });
                chart.interactiveLayer.dispatch.on('elementMouseout.mainphillips', function(e) {
                if(leftVis!=null)leftVis.lines.clearHighlights();
                });
            }
            jsonWait();
            return chart;
        });
    });
}
function removeGraph(graph, chartobject) {
    if( chartobject != null) chartobject.tooltips(false);//chartobject.useInteractiveGuideLines(false);
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    //removeGraph('main');
    mainchart.tooltips(false);
    if (mainfocus) {
        mainfocus = !mainfocus;
        drawmain(mainfocus, true, true);
    }
    else if (mainchart.useInteractiveGuideline() == true) {
        console.log('interactive is true:   ' + mainchart.useInteractiveGuideline());
        drawmain(mainfocus, false, true);
    } else {
        console.log('interactive is false');
        drawmain(mainfocus, true, true);
    }
}

function setFocusMode() {
    console.log("setFocus Mode");
    //removeGraph('main');
    mainfocus = !mainfocus;

    drawmain(mainfocus, false, true);
}

function NormaliseMode() {

}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawleftvis() {
    //console.log(phillipsData());
    drawUpperVis('leftvis','Inflation', 'Unemployment',phillipsData());
}

//Draw the top left visualisation
function drawmiddlevis() {
    drawUpperVis('middlevis','Inflation', 'Unemployment',phillipsData());
}

//Draw the top left visualisation
function drawrightvis() {
    drawUpperVis('rightvis','Inflation', 'Unemployment',phillipsData());
}

/*A asynchronous callback wrapper. This makes the upper visualisations wait for the main visualisation to be drawn*/
function jsonWait(){
    drawleftvis();
    drawmiddlevis();
    drawrightvis();
}
function drawUpperVis(visid,leftLabel,bottomLabel,data) {
    nv.addGraph(function () {
        console.log('drawing '+visid);
        var chart = nv.models.lineChart();
        chart.xAxis.tickFormat(d3.format('f')).tickValues([]);
        chart.yAxis.tickFormat(d3.format('f')).tickValues([]);
        chart.yAxis.tickValues([]).showMaxMin(true);
        chart.showLegend(false);
        chart.y(function (d) {
            if (d.y == "") return null;
            return parseFloat(d.y)
        });
        chart.x(function (d) {
            return parseFloat(d.x)
        });
        //chart.interpolate('linear-closed');
        chart.pointShape('cross');
        if(leftLabel!=null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-30);
        if(bottomLabel!=null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);
        //chart.xAxis.ticks(true);
        chart.pointActive(function (d) {  return d.notActive;});
        //chart.width(parseInt(d3.select('#' + visid + ' svg').style('width')));
        //chart.height(parseInt(d3.select('#' + visid + ' svg').style('height')));
        chart.tooltipContent(function (key, y, e, graph) {
            var content = '<h3 style="background-color: ';
            content += e.color + '">';
            content += '</h3><p>' + y + '</p>';
            return content;
        });
        chart.margin({"left": 35, "right": 30, "top": 10, "bottom": 30});
        /*chart.options({
            useInteractiveGuideLines: true
            , showLegend: false
            //,showYAxis : false
            //,showXAxis : false
        });*/
        d3.select('#' + visid + ' svg').datum(data).call(chart);
        nv.utils.windowResize(chart.update);

        if(visid=='leftvis')leftVis = chart;
        else if (visid=='middlevis')middleVis = chart;
        else if (visid=='rightvis')rightVis = chart;
    });
}
function phillipsData() {
    var historicPhillipsCurve = [],
        phillips = [],
        inflationSeries,
        unemploymentSeries;

    //console.log(maindata);
    if(maindata ==null) return;
    console.log('drawing scatter phillips');
    maindata.forEach(function (series, i) {

        if (!series.key.indexOf('Inflation'))inflationSeries = series.values;
        if (!series.key.indexOf('Unemployment'))unemploymentSeries = series.values;
    });
    for(var i = 0;i<unemploymentSeries.length; i++){
        var unemploymentVal = unemploymentSeries[i].y, inflationVal = inflationSeries[i].y;
        //console.log({x:unemploymentVal, y:inflationVal});
       if(unemploymentVal!= '' && inflationVal!='') historicPhillipsCurve.push({x:unemploymentVal, y:inflationVal});
    }

    for (var i = 1; i < 20; i++) {
        //scatter.push({x: i, y: i % 10 == 5 ? null : Math.sin(i / 10)}); //the nulls are to show how defined works
        phillips.push({x: i, y: (1 / i) > 100 ? null : (1 / i)});
    }
    return [
//area: true,
        {
            values: phillips,
            key: "Theoretical Curve"

        },
        {
            values: historicPhillipsCurve,
            key: "Historic Values",
            color: "#2ca02c", shape: 'circle'
        },
    ];
}