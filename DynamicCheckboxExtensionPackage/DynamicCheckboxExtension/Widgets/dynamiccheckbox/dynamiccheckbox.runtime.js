TW.Runtime.Widgets.dynamiccheckbox = function() {

   var thisWidget = this,
       defaultState = undefined,
       defaultVisible = undefined,
       defaultDisabled = undefined,
       defaultValue = undefined;

   this.runtimeProperties = function() {
      return {
         'needsDataLoadingAndError': false
      };
   };

   this.renderHtml = function() {

      var html, 
         cssInfo = TW.getStyleCssTextualFromStyleDefinition(this.getProperty('Style', 'DefaultCheckboxStyle')),
         textSize = TW.getTextSizeFromStyleDefinition(this.getProperty('Style')),
         cssInfo = TW.getStyleCssTextualFromStyleDefinition(this.getProperty('Style')),
         prompt = (this.getProperty('Prompt') !== undefined ? Encoder.htmlEncode(this.getProperty('Prompt')) : ''),
         disabled = (thisWidget.getProperty('Disabled') === true) ? 'disabled' : '',
         tabSequence = thisWidget.getProperty('TabSequence');

      defaultState = (String(thisWidget.getProperty('State')) == "true") ? true : false;
      defaultVisible = (String(thisWidget.getProperty('Visible')) == "true") ? true : false;
      defaultDisabled = (String(thisWidget.getProperty('Disabled')) == "true") ? true : false;
      defaultValue = thisWidget.getProperty('Value');

      if (cssInfo.length > 0) {
         cssInfo = 'style="' + cssInfo + '"';
      }

      html = '<div class="widget-content widget-checkbox ' + textSize + '" width="100%" height="100%" ' + cssInfo + '>';
      html += '<input type="checkbox" class="input-checkbox" ' + disabled + ' tabindex="' + tabSequence + '"></input>';
      html += '<span class="prompt-checkbox">' + prompt + '</span>';
      html += '</div>';

      return html;
   };

   this.afterRender = function() {
      var widgetElement = this.jqElement,
          checkboxElement = widgetElement.find('input'),
          widgetProperties = this.properties,
          widgetReference = this;

      checkboxElement.bind('change', function() {
         var newValue = checkboxElement.attr('checked');
         if (newValue === 'checked' || newValue === 'true') {
            widgetReference.setProperty('State', true);
         } else {
            widgetReference.setProperty('State', false);
         }

         widgetElement.triggerHandler('Changed');
      });

      var curState = widgetReference.getProperty('State');
      if (String(curState) == "true") {
         checkboxElement.prop('checked', true);
         widgetReference.setProperty('State', true);
      } else {
         checkboxElement.prop('checked', false);
         widgetReference.setProperty('State', false);
      }

      if (String(widgetReference.getProperty('Visible')) == "true") {
         widgetElement.show();
      } else {
         widgetElement.hide()
      }

      if (String(widgetReference.getProperty('Disabled')) == "true") {
         checkboxElement.prop('disabled', true);
      } else {
         checkboxElement.prop('enabled', false);
      }

      checkboxElement.val(widgetReference.getProperty('Value'));

   };

   this.updateProperty = function(updatePropertyInfo) {

      if (updatePropertyInfo.TargetProperty === "Top" || updatePropertyInfo.TargetProperty === "Left" || updatePropertyInfo.TargetProperty === "Width" || updatePropertyInfo.TargetProperty === "Height") {

         this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.SinglePropertyValue);
         this.jqElement.css(updatePropertyInfo.TargetProperty, updatePropertyInfo.SinglePropertyValue + "px");

      } else if (updatePropertyInfo.TargetProperty === "State") {

         if (String(updatePropertyInfo.SinglePropertyValue) == "true") {
            this.jqElement.find('input').prop('checked', true);
            this.setProperty('State', true);
         } else {
            this.jqElement.find('input').prop('checked', false);
            this.setProperty('State', false);
         }

      } else if (updatePropertyInfo.TargetProperty === "Disabled") {

         if (String(updatePropertyInfo.SinglePropertyValue) == "true") {
            this.jqElement.find('input').prop('disabled', true);
            this.setProperty('Disabled', true);
         } else {
            this.jqElement.find('input').prop('disabled', false);
            this.setProperty('Disabled', false);
         }

      } else if (updatePropertyInfo.TargetProperty === "Visible") {

         if (String(updatePropertyInfo.SinglePropertyValue) == "true") {
            this.jqElement.show();
            this.setProperty('Visible', true);
         } else {
            this.jqElement.hide();
            this.setProperty('Visible', false);
         }

      } else if (updatePropertyInfo.TargetProperty === "Value") {

         this.jqElement.find('input').val(updatePropertyInfo.SinglePropertyValue);
         this.setProperty('Value', updatePropertyInfo.SinglePropertyValue);

      }
   };

   this.resetInputToDefault = function() {
      var checkboxElement = thisWidget.jqElement.find('input');

      if (defaultState === true) {
         checkboxElement.prop('checked', true);
         thisWidget.setProperty('State', true);
      } else {
         checkboxElement.prop('checked', false);
         thisWidget.setProperty('State', false);
      }

      if (defaultVisible === true) {
         this.jqElement.show();
         this.setProperty('Visible', true);
      } else {
         this.jqElement.hide();
         this.setProperty('Visible', false);
      }

      if (defaultDisabled === true) {
         this.jqElement.find('input').prop('disabled', true);
         this.setProperty('Disabled', true);
      } else {
         this.jqElement.find('input').prop('disabled', false);
         this.setProperty('Disabled', false);
      }

      this.jqElement.find('input').val(defaultValue === undefined ? '' : defaultValue);
      this.setProperty('Value', defaultValue);
   };

   this.beforeDestroy = function() {
      try {
         var checkboxElement = this.jqElement.find('input');
         checkboxElement.unbind();
      } catch (err) {
         TW.log.error('Error in TW.Runtime.Widgets.checkbox.beforeDestroy', err);
      }
   };
};
