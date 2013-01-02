TW.Runtime.Widgets.dynamiccheckbox = function() {
  var thisWidget = this
  var defaultState = undefined
  var defaultVisible = undefined
  var defaultDisabled = undefined
  var defaultValue = undefined

  this.runtimeProperties = function() {
    return {
      'needsDataLoadingAndError': false
    }
  }

  this.renderHtml = function() {

    var html
    var cssInfo = TW.getStyleCssTextualFromStyleDefinition(this.getProperty('Style', 'DefaultCheckboxStyle'))
    var textSize = TW.getTextSizeFromStyleDefinition(this.getProperty('Style'))
    var cssInfo = TW.getStyleCssTextualFromStyleDefinition(this.getProperty('Style'))
    var prompt = (this.getProperty('Prompt') !== undefined ? Encoder.htmlEncode(this.getProperty('Prompt')) : '')
    var disabled = (thisWidget.getProperty('Disabled') === true) ? 'disabled' : ''
    var tabSequence = thisWidget.getProperty('TabSequence')

    defaultState = (String(thisWidget.getProperty('State')) == "true") ? true : false
    defaultVisible = (String(thisWidget.getProperty('Visible')) == "true") ? true : false
    defaultDisabled = (String(thisWidget.getProperty('Disabled')) == "true") ? true : false
    defaultValue = thisWidget.getProperty('Value')

    if (cssInfo.length > 0) {
      cssInfo = 'style="' + cssInfo + '"'
    }

    html = '<div class="widget-content widget-checkbox ' + textSize + '" width="100%" height="100%" ' + cssInfo + '>'
    html += '<input type="checkbox" class="input-checkbox" ' + disabled + ' tabindex="' + tabSequence + '"></input>'
    html += '<span class="prompt-checkbox">' + prompt + '</span>'
    html += '</div>'

    return html
  }

  this.afterRender = function() {
    var widgetElement = this.jqElement
    var checkboxElement = widgetElement.find('input')
    var widgetProperties = this.properties
    var widgetReference = this

    checkboxElement.bind('change', function() {
      var newValue = checkboxElement.attr('checked')

      (newValue === 'checked' || newValue === 'true') ? widgetReference.setProperty('State', true) : widgetReference.setProperty('State', false)

      widgetElement.triggerHandler('Changed')
    })

    var curState = widgetReference.getProperty('State')
  
    if (String(curState) == "true") {
      checkboxElement.prop('checked', true)
      widgetReference.setProperty('State', true)
    } else {
      checkboxElement.prop('checked', false)
      widgetReference.setProperty('State', false)
    }

    if (String(widgetReference.getProperty('Visible')) == "true") {
      widgetElement.show()
    } else {
      widgetElement.hide()
    }

    if (String(widgetReference.getProperty('Disabled')) == "true") {
      checkboxElement.prop('disabled', true)
    } else {
      checkboxElement.prop('enabled', false)
    }

    checkboxElement.val(widgetReference.getProperty('Value'))
  }

  this.updateProperty = function(updatePropertyInfo) {

    var setProperty = function (propertyInfo, property, state) {
      if (String(propertyInfo.SinglePropertyValue) === 'true') {
        this.jqElement.find('input').prop(property, true)
        this.setProperty(state, true)
      } else {
        this.jqElement.find('input').prop(property, false)
        this.setProperty(state, false)
      }
    }

    var setVisibility = function (condition) {
      if (String(condition) === 'true') {
        this.jqElement.show()
        this.setProperty('Visible', true)
      } else {
        this.jqElement.hide()
        this.setProperty('Visible', false)
      }
    }

    switch (updatePropertyInfo.TargetProperty) {
      case 'Top':
      case 'Left':
      case 'Width':
      case 'Height':
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.SinglePropertyValue)
        this.jqElement.css(updatePropertyInfo.TargetProperty, updatePropertyInfo.SinglePropertyValue + "px")
      case 'State':
        setProperty(updatePropertyInfo, 'checked', 'State')
        break
      case 'Disabled':
        setProperty(updatePropertyInfo, 'disabled', 'Disabled')
        break
      case 'Visible':
        setVisibility(updatePropertyInfo.SinglePropertyValue)
        break
      case 'Value':
        this.jqElement.find('input').val(updatePropertyInfo.SinglePropertyValue)
        this.setProperty('Value', updatePropertyInfo.SinglePropertyValue)
        break
      default:
    }
  }

  this.resetInputToDefault = function() {
    var checkboxElement = thisWidget.jqElement.find('input')

    // refactor
    if (defaultState === true) {
      checkboxElement.prop('checked', true)
      thisWidget.setProperty('State', true)
    } else {
      checkboxElement.prop('checked', false)
      thisWidget.setProperty('State', false)
    }

    setVisibility(defaultVisible === true)
    
    // refactor
    if (defaultDisabled === true) {
      this.jqElement.find('input').prop('disabled', true)
      this.setProperty('Disabled', true)
    } else {
      this.jqElement.find('input').prop('disabled', false)
      this.setProperty('Disabled', false)
    }

    this.jqElement.find('input').val(defaultValue === undefined ? '' : defaultValue)
    this.setProperty('Value', defaultValue)
  }

  this.beforeDestroy = function() {
    try {
      var checkboxElement = this.jqElement.find('input')
      checkboxElement.unbind()
    } catch (err) {
      TW.log.error('Error in TW.Runtime.Widgets.checkbox.beforeDestroy', err)
    }
  }
}