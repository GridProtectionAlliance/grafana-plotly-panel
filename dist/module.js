'use strict';

System.register(['app/plugins/sdk', 'lodash', 'moment', 'angular', './external/plotly'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, moment, angular, Plotly, _createClass, PlotlyPanelCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

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
                a(event, data);
            });
        }
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_moment) {
            moment = _moment.default;
        }, function (_angular) {
            angular = _angular.default;
        }, function (_externalPlotly) {
            Plotly = _externalPlotly;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('PanelCtrl', PlotlyPanelCtrl = function (_MetricsPanelCtrl) {
                _inherits(PlotlyPanelCtrl, _MetricsPanelCtrl);

                function PlotlyPanelCtrl($scope, $injector, $q, $rootScope, $timeout, $window, timeSrv, uiSegmentSrv) {
                    _classCallCheck(this, PlotlyPanelCtrl);

                    var _this = _possibleConstructorReturn(this, (PlotlyPanelCtrl.__proto__ || Object.getPrototypeOf(PlotlyPanelCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.timeSrv = timeSrv;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.q = $q;

                    _this.sizeChanged = true;
                    _this.initalized = false;

                    _this.$tooltip = $('<div id="tooltip" class="graph-tooltip">');

                    console.log("Instantiated ...");
                    _this.layout = $.extend(true, {}, _this.panel.pconfig.layout);

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('panel-initialized', _this.onPanelInitalized.bind(_this));
                    _this.events.on('refresh', _this.onRefresh.bind(_this));
                    _this.cachedData = null;

                    angular.element($window).bind('resize', _this.onResize.bind(_this));
                    return _this;
                }

                _createClass(PlotlyPanelCtrl, [{
                    key: 'onResize',
                    value: function onResize() {
                        console.log("onResize()");
                        this.sizeChanged = true;
                        if (this.cachedData != null) {
                            $('#plotlyChart').height($(window).innerHeight() - $('#menuBar').outerHeight() - $('#pageHeader').outerHeight() - 50);
                            Plotly.purge('plotlyChart');
                            makeBarChart(this.cachedData, this.panel.pconfig);
                        }
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        console.log("onDataError", err);
                    }
                }, {
                    key: 'onRefresh',
                    value: function onRefresh() {
                        console.log("onRefresh()");
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        console.log("onInitEditMode()");
                        this.addEditorTab('Options', 'public/plugins/natel-plotly-panel/editor.html', 1);
                        this.editorTabIndex = 1;
                        this.refresh();
                    }
                }, {
                    key: 'onSegsChanged',
                    value: function onSegsChanged() {
                        console.log("onSegsChanged()");
                    }
                }, {
                    key: 'onPanelInitalized',
                    value: function onPanelInitalized() {
                        console.log("onPanelInitalized()");
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        console.log("onRender");
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        console.log("onDataRecieved");
                        this.cachedData = angular.copy(dataList);
                        makeBarChart(dataList, this.panel.pconfig);
                    }
                }, {
                    key: 'onConfigChanged',
                    value: function onConfigChanged() {
                        console.log("Config changed...");
                        this.onResize();
                    }
                }]);

                return PlotlyPanelCtrl;
            }(MetricsPanelCtrl));

            PlotlyPanelCtrl.templateUrl = 'module.html';
            _export('PanelCtrl', PlotlyPanelCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
