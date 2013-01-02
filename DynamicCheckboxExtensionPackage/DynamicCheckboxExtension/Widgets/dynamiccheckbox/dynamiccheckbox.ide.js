TW.IDE.Widgets.dynamiccheckbox = function() {

   this.widgetProperties = function() {
      return {
         'name': 'Dynamic Checkbox',
         'description': 'Adds to checkbox with optional bindable value',
         'category': ['Common'],
         'dataSourceProperty': 'State',
         'defaultBindingTargetProperty': 'State',
         'supportsResetInputToDefault': true,
         'properties': {
            'Prompt': {
               'defaultValue': 'Check this box',
               'baseType': 'STRING'
            },
            'Width': {
               'defaultValue': 120
            },
            'Height': {
               'defaultValue': 20,
               'isEditable': false
            },
            'State': {
               'isBindingSource': true,
               'isBindingTarget': true,
               'baseType': 'BOOLEAN',
               'defaultValue': false
            },
            'Disabled': {
               'isBindingSource': true,
               'isBindingTarget': true,
               'baseType': 'BOOLEAN',
               'defaultValue': false
            },
            'Visible': {
               'isBindingSource': true,
               'isBindingTarget': true,
               'baseType': 'BOOLEAN',
               'defaultValue': true
            },
            'Value': {
               'isBindingTarget': true,
               'isBindingSource': true,
               'baseType': 'STRING',
               'defaultValue': ''
            },
            'TabSequence': {
               'description': 'Tab sequence index',
               'baseType': 'NUMBER',
               'defaultValue': 0
            },
            'Style': {
               'baseType': 'STYLEDEFINITION',
               'defaultValue': 'DefaultCheckboxStyle'
            }
         }
      };
   };

   this.widgetEvents = function() {
      return {
         'Changed': {}
      }
   };

   this.renderHtml = function() {
      var html, 
         textSize = TW.getTextSizeFromStyleDefinition(this.getProperty('Style')),
         cssInfo = TW.getStyleCssTextualFromStyleDefinition(this.getProperty('Style')),
         prompt = (this.getProperty('Prompt') !== undefined ? Encoder.htmlEncode(this.getProperty('Prompt')) : '');

      if (cssInfo.length > 0) {
         cssInfo = 'style="' + cssInfo + '"';
      }

      html = '<div class="widget-content widget-checkbox ' + textSize + '" width="100%" height="100%"' + cssInfo + '>';
      html += '<input type="checkbox" class="input-checkbox" />';
      html += '<span class="prompt-checkbox">' + prompt + '</span>';
      html += '</div>';

      return html;
   };


   this.afterSetProperty = function(name, value) {
      var result = false;
      switch (name) {
      case 'Value':
      case 'Visible':
      case 'Disabled':
      case 'Prompt':
      case 'Style':
         result = true;
         break;
      }
      return result;
   };

   this.validate = function() {
      var result = [];
      if (!this.isPropertyBoundAsSource('State') && !this.isPropertyBoundAsTarget('State')) {
         result.push({
            severity: 'warning',
            message: 'State for {target-id} is not bound as a source or to any target'
         });
      }

      return result;
   };

};
