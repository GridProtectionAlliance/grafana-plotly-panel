
import {MetricsPanelCtrl} from  'app/plugins/sdk';

import _ from 'lodash';
import moment from 'moment';
import angular from 'angular';

import * as Plotly from './external/plotly';

class PlotlyPanelCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, $q, $rootScope, $timeout, $window, timeSrv, uiSegmentSrv) {
    super($scope, $injector);

    this.$rootScope = $rootScope;
    this.timeSrv = timeSrv;
    this.uiSegmentSrv = uiSegmentSrv;
    this.q = $q;

    this.sizeChanged = true; 
    this.initalized = false;
    
    this.$tooltip = $('<div id="tooltip" class="graph-tooltip">');

    console.log("Instantiated ...");
    this.layout = $.extend(true, {}, this.panel.pconfig.layout );

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));
    this.cachedData = null;

    angular.element($window).bind('resize', this.onResize.bind(this) );
  }

  onResize() {
    console.log("onResize()");
    this.sizeChanged = true;
    if (this.cachedData != null) {
        $('#plotlyChart').height($(window).innerHeight() - $('#menuBar').outerHeight() - $('#pageHeader').outerHeight() - 50);
        Plotly.purge('plotlyChart');
        makeBarChart(this.cachedData, this.panel.pconfig);

    }
  }

  onDataError(err) {
    console.log("onDataError", err);
  }

  onRefresh() {
    console.log("onRefresh()")
  }

  onInitEditMode() {
      console.log("onInitEditMode()");
      this.addEditorTab('Options', 'public/plugins/natel-plotly-panel/editor.html', 1);
      this.editorTabIndex = 1;
      this.refresh();
  }

  onPanelInitalized() {
    console.log("onPanelInitalized()")
  }

  onRender() {
    console.log("onRender");
  }

  onDataReceived(dataList) {
      console.log("onDataRecieved");
      this.cachedData = angular.copy(dataList);
      makeBarChart(dataList, this.panel.pconfig);
  }

  onConfigChanged() {
      console.log("Config changed...");
      this.onResize();
  }

  //---------------------------

    
}
PlotlyPanelCtrl.templateUrl = 'module.html';

function makeBarChart(data, pconfig) {
    var fields = [];
    //var startDate = new Date(data.StartDate);
    //var endDate = new Date(data.EndDate);

    // The data should arrive as an array of objects that can be iterated through
    // and the way the datapoints can be filtered can be entered through the UI
    $.each(data, function (i, d) {
        fields.push({
            x: eval(pconfig.settings.xSeriesData),
            y: eval(pconfig.settings.ySeriesData),
            name: d.target.split('_')[1],
            type: pconfig.settings.type
        });
    });

    var layout = {
        xaxis: {
            title: pconfig.layout.xaxis.label,
            type: pconfig.layout.xaxis.type,
            tickFormat: Plotly.d3.time.format.utc("%m-%d"),
            range: []
        },
        yaxis: {
            title: pconfig.layout.yaxis.label,
            range: [],
            type: pconfig.layout.yaxis.type
        },
        barmode: pconfig.settings.mode,
        showlegend: pconfig.settings.displayLegend,
        plot_bgcolor: pconfig.layout.plot_bgcolor,
        paper_bgcolor: pconfig.layout.paper_bgcolor,
        dragmode: pconfig.settings.dragmode,
        font: pconfig.layout.font
    };

    Plotly.newPlot('plotlyChart', fields, layout);
    $('#plotlyChart').off('plotly_click');

    if (pconfig.settings.allowClickEvents) {
        $('#plotlyChart').on('plotly_click', function (event, data) {
            var a = new Function('event', 'data', pconfig.settings.onClickCallback);
            a(event,data);
        });
    }


}

export {
  PlotlyPanelCtrl as PanelCtrl
};


