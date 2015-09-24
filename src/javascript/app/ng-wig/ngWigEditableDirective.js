angular.module('ngWig')
  .directive('ngWigEditable', function () {
    function init(scope, $element, attrs, ngModelController) {
      var document = $element[0].ownerDocument;

      $element.attr('contenteditable', true);

      //model --> view
      ngModelController.$render = function () {
        $element.html(ngModelController.$viewValue || '');
      };

      //view --> model
      function viewToModel() {
        ngModelController.$setViewValue($element.html());
      }

      $element.bind('blur keyup change paste', viewToModel);

      $element.bind('blur keyup change paste focus click', function() {
        scope.$applyAsync();
      });

      scope.isEditorActive = function () {
        return $element[0] === document.activeElement;
      };

      scope.$on('execCommand', function (event, params) {
        $element[0].focus();

        var ieStyleTextSelection = document.selection,
          command = params.command,
          options = params.options;

        if (ieStyleTextSelection) {
          var textRange = ieStyleTextSelection.createRange();
        }

        if (document.queryCommandSupported && !document.queryCommandSupported(command)) {
          throw 'The command "' + command + '" is not supported';
        }

        document.execCommand(command, false, options);

        if (ieStyleTextSelection) {
          textRange.collapse(false);
          textRange.select();
        }

        viewToModel();
      });
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      replace: true,
      link: init
    }
  }
);
