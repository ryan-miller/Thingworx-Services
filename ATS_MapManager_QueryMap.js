var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName : "InfoTable",
  dataShapeName : "ATSMapShape"
})

var fullFilteredDevices = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName : "InfoTable",
  dataShapeName : "ATSMapShape"
})

// get my sites
var filteredSites = me.GetAccountSites({
  IncludeHiddenAccounts : false
})

// get initial my devices list
var myDevices = me.GetAccountDevices()
var filteredDevices = Resources['InfoTableFunctions'].Query({
  query : {
    filters : {
      type: 'OR',
      filters : [{
        type: 'EQ',
        fieldName: 'IsClearedFromMap',
        value: true
      }, {
        type: 'NotNear',
        fieldName: 'Location',
        distance: 1,
        units: 'M',
        location: {
          latitude: 0.0,
          longitude: 0.0,
          elevation: 0,
          units: 'WGS84'
        }
      }]
    }
  },
  t : myDevices
})

/*
  remove hidden sites
  not a simple filter as Device.Sites.IsHidden is not available in result set
  also can not do a 'NotIn' filter as that kind of filter does not work
  when some rows are null or empty
*/
var hiddenSites = []
for each(var row in filteredDevices.rows) {
  if (row.Site !== '' && Things[row.Site].IsHidden) {
    hiddenSites.push(row.Site)
  }
}

var i = 0
var hiddenSiteCount = hiddenSites.length
for (i; i < hiddenSiteCount; i++) {
  filteredDevices = Resources['InfoTableFunctions'].Query({
    query: {
      filters: {
        type: 'NE',
        fieldName: 'Site',
        value: hiddenSites[i]
      }
    },
    t: filteredDevices
  })
}

// main logic




 