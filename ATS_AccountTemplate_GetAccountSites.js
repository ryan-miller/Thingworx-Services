var filters
var result
var customerAccountFilter, hiddenAccountFilter

customerAccountFilter = {
  type: 'EQ',
  fieldName: 'CustomerAccount',
  value: me.name
}

hiddenAccountFilter = {
  type: 'EQ',
  fieldName: 'IsHidden',
  value: false
}

if (IncludeHiddenAccounts) {
  filters = {
    filters: customerAccountFilter
  }
} else {
  filters = {
    filters: {
      type: 'AND',
      filters: [customerAccountFilter, hiddenAccountFilter]
    }
  }
}

result = ThingTemplates['ATSSiteTemplate'].QueryImplementingThingsWithData({
  nameMask: "*",
  query: filters,
  maxItems: 500
})