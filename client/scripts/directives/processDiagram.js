/* global define: false */
define([
  'angular',
  'jquery',
  'text!./processDiagram.html'
], function(angular, $, template) {
  'use strict';
  /* jshint unused: false */
  var _unique = 0;
  function unique(prefix) {
    _unique++;
    return (prefix ? prefix +'_' : '') + _unique;
  }

  var DirectiveController = ['$scope', '$compile', 'Views', '$timeout',
                    function( $scope,   $compile,   Views,   $timeout) {

    $scope.overlayVars = { read: [ 'processData', 'bpmnElement', 'pageData' ] };
    $scope.overlayProviders = Views.getProviders({ component:  $scope.providerComponent });
    var overlay = '<div class="bpmn-overlay"><div view ng-repeat="overlayProvider in overlayProviders" provider="overlayProvider" vars="overlayVars"></div></div>';

    var bpmnElements,
        selection,
        scrollToBpmnElementId;

    $scope.$on('$destroy', function() {
      $scope.processDiagram = null;
      $scope.overlayProviders = null;
    });

    $scope.control = {};

    /**
     * If the process diagram changes, then the diagram will be rendered.
     */
    $scope.$watch('processDiagram', function(newValue) {
      if (newValue && newValue.$loaded !== false) {
        bpmnElements = newValue.bpmnElements;
        $scope.diagramData = newValue.bpmnDefinition;
      }
    });

    $scope.onLoad = function() {
      decorateDiagram($scope.processDiagram.bpmnElements);

      // update selection in case it has been provided earlier
      updateSelection(selection);

      // update scroll to in case it has been provided earlier
      scrollToBpmnElement(scrollToBpmnElementId);
    };

    var isElementSelectable = function(element) {
      return element.isSelectable || (
        $scope.selectAll &&
        element.$instanceOf('bpmn:FlowNode')
      );
    };

    $scope.onClick = function(element, $event) {
      if(bpmnElements[element.businessObject.id] && isElementSelectable(bpmnElements[element.businessObject.id])) {
        $scope.onElementClick({id: element.businessObject.id, $event: $event});
      } else {
        $scope.onElementClick({id: null, $event: $event});
      }
    };

    $scope.onMouseEnter = function(element, $event) {
      if(bpmnElements[element.businessObject.id] && isElementSelectable(bpmnElements[element.businessObject.id])) {
        $scope.control.getViewer().get('canvas').addMarker(element.businessObject.id, 'selectable');
        $scope.control.highlight(element.businessObject.id);
      }
    };

    $scope.onMouseLeave = function(element, $event) {
      if(bpmnElements[element.businessObject.id] &&
         isElementSelectable(bpmnElements[element.businessObject.id]) &&
         (!selection || selection.indexOf(element.businessObject.id) === -1) &&
         (!selection || selection.indexOf(element.businessObject.id + '#multiInstanceBody') === -1)) {
        $scope.control.clearHighlight(element.businessObject.id);
      }
    };

    /*------------------- Decorate diagram ---------------------*/

    function decorateDiagram(bpmnElements) {
      angular.forEach(bpmnElements, function (bpmnElement) {
        decorateBpmnElement(bpmnElement);
      });
    }

    function decorateBpmnElement(bpmnElement) {

      var elem = $scope.control.getElement(bpmnElement.id);

      if(elem) {
        var childScope = $scope.$new();

        childScope.bpmnElement = bpmnElement;

        var newOverlay = angular.element(overlay);

        newOverlay.css({
          width: elem.width,
          height: elem.height
        });

        $compile(newOverlay)(childScope);

         try {
          $scope.control.createBadge(bpmnElement.id, {
            html: newOverlay,
            position: {
              top: 0,
              left: 0
            }
          });
        } catch (exception) {
          // console.log('exception while creating badge for '+bpmnElement.id+':', exception);
        }
      }
    }

    /*------------------- Handle selected activity id---------------------*/

    $scope.$watch('selection.activityIds', function(newValue, oldValue) {
      updateSelection(newValue);
    });

    function updateSelection(newSelection) {
      if ($scope.control.isLoaded()) {
        if (selection) {
          angular.forEach(selection, function(elementId) {
            if(elementId.indexOf('#multiInstanceBody') !== -1 &&
               elementId.indexOf('#multiInstanceBody') === elementId.length - 18) {
              elementId = elementId.substr(0, elementId.length - 18);
            }
            if(bpmnElements[elementId]) {
              $scope.control.clearHighlight(elementId);
            }
          });
        }

        if (newSelection) {
          angular.forEach(newSelection, function(elementId) {
            if(elementId.indexOf('#multiInstanceBody') !== -1 &&
               elementId.indexOf('#multiInstanceBody') === elementId.length - 18) {
              elementId = elementId.substr(0, elementId.length - 18);
            }
            if(bpmnElements[elementId]) {
              $scope.control.highlight(elementId);
            }
          });
        }
      }

      $scope.$root.$emit('instance-diagram-selection-change', newSelection);

      selection = newSelection;
    }

    /*------------------- Handle scroll to bpmn element ---------------------*/

    $scope.$watch('selection.scrollToBpmnElement', function(newValue) {
      if (newValue) {
        scrollToBpmnElement(newValue);
      }
    });

    function scrollToBpmnElement(bpmnElementId) {
      if ($scope.control.isLoaded() && bpmnElementId) {
        scrollTo(bpmnElementId);
      }
      scrollToBpmnElementId = bpmnElementId;
    }

    function scrollTo(elementId) {
      if(bpmnElements[elementId]) {
        $scope.control.scrollToElement(elementId);
      }
    }

  }];

  var Directive = function ($compile, Views) {
    return {
      restrict: 'EAC',
      scope: {
        processDiagram: '=',
        processDiagramOverlay: '=',
        onElementClick: '&',
        selection: '=',
        processData: '=',
        pageData: '=',
        providerComponent: '@',
        selectAll: '&'
      },
      controller: DirectiveController,
      template: template,

      link: function($scope) {
        $scope.selectAll = $scope.$eval($scope.selectAll);
      }
    };
  };

  Directive.$inject = [ '$compile', 'Views'];

  return Directive;
});
