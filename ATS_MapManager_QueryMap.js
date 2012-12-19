/*
ThingName
DisplayName/Nickname
GPSLocation
IconState:
  
  DeviceNormal              :GreenShield,
  DeviceMissing             :GreyShield,
  DeviceAlert               :YellowShield,
  DeviceConflict            :RedShield, 

  LocationEmpty             :EmptyBlueBox, 
  LocationNormal            :GreenShieldInsideBlueBox, 
  LocationMissing           :GreyShieldInsideBlueBox, 
  LocationAlert             :YellowShieldInsideBlueBox, 
  LocationConflictEmpty     :RedBox 
  LocationConflictNormal    :GreenSheildInsideRedBox   
  LocationConflictMissing   :GreyShieldInsideRedBox, 
  LocationConflictAlert     :YellowShieldInsideRedBox,

*/

try {
  var details = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
    infoTableName : "InfoTable",
    dataShapeName : "ATSMapShape"
  })

  var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
    infoTableName : "InfoTable",
    dataShapeName : "ATSMapShape"
  })

  var addLocationRows = (function () {
    var site
    for each (site in me.GetAccountSites().rows) {
      details.AddRow({
        Thing:          site.name, 
        DisplayName:    site.SiteName, 
        Location:       site.Location,
        State:          'Location',
        TypePriority:   1,
        StatePriority:  999
      })
    }
  })()

  var addDeviceRows = (function () {
    var device, state, priority
    var recentAlert, recentLogin
    var loginDiffInSec
    var singleDayInMs = 24 * 60 * 60 * 1000
    var now = new Date()
    var yesterdayInMs = now.getTime() - singleDayInMs

    for each(device in me.GetAccountDevices().rows){
      priority = 0
      state = 'Device'

      recentAlert = (device.Alerts_LastAlertTime.getTime() > yesterdayInMs) ? true : false  
    
      loginDiffInSec = (now.getTime() - device.LastLogin.getTime()) / (60 * 1000)
      recentLogin = (loginDiffInSec < device.WEB_ServerContactFrequency) ? true : false

      if (device.IsConflictedWithSiteGPS) {
        state += 'Conflict'
        priority = 1
      } else if (recentAlert) {
        state += 'Alert'
        priority = 2
      } else if (!recentLogin) {
        state += 'Missing'
        priority = 3
      } else {
        state += 'Normal'
        priority = 4
      }

      details.AddRow({   
        Thing:        device.name,
        DisplayName:  device.Nickname, 
        Location:     device.Location,
        State:        state,
        TypePriority: 2,
        StatePriority: priority
      })
    }
  })()

  var agg = Resources['InfoTableFunctions'].Aggregate({
    columns : 'Location,TypePriority,StatePriority',
    groupByColumns : 'Location',
    t : details,
    aggregates : 'COUNT,MIN,MIN'
  })

  var findByTypeAndState = function (location, type, state) {
    return Resources['InfoTableFunctions'].Query({
      query: {
        filters: {
          type : 'AND',
          filters : [{
            type: 'GE',
              fieldName: 'TypePriority',
              value: type
          }, {
            type: 'EQ',
            fieldName: 'StatePriority',
            value: state
          }, {
            type: 'EQ',
            fieldName: 'Location',
            value: location
          }]
        }
      },
      t : details
    })
  }

  var findByTypeAndLocation = function (t, type, loc) {
    logger.warn('findbytypeandlocation' + t + type + loc)
    return Resources['InfoTableFunctions'].Query({
      query: {
        filters: {
          type : 'AND',
          filters : [{
            type: 'EQ',
              fieldName: 'TypePriority',
              value: type
          }, {
            type: 'EQ',
            fieldName: 'Location',
            value: loc
          }]
        }
      },
      t: t
    })
  }

  var findByStateAndLocation = function (t, state, loc) {
    logger.warn('findbystateandlocation' + t + state + loc)
    return Resources['InfoTableFunctions'].Query({
      query: {
        filters: {
          type : 'AND',
          filters : [{
            type: 'EQ',
              fieldName: 'StatePriority',
              value: state
          }, {
            type: 'EQ',
            fieldName: 'Location',
            value: loc
          }]
        }
      },
      t: t
    })
  }

  var findState = function (loc) {
    var allAtLocation = Resources['InfoTableFunctions'].Query({
      query: {
        filters : {
          type: 'EQ',
          fieldName: 'Location',
          value: loc
        }
      },
      t: details
    })

    var isSite      = (findByTypeAndLocation(allAtLocation, 1, loc).getRowCount() > 0)
    var isConflict  = (findByStateAndLocation(allAtLocation, 1, loc).getRowCount() > 0)
    var isAlert     = (findByStateAndLocation(allAtLocation, 2, loc).getRowCount() > 0)
    var isMissing   = (findByStateAndLocation(allAtLocation, 3, loc).getRowCount() > 0)
    var isNormal    = (findByStateAndLocation(allAtLocation, 4, loc).getRowCount() > 0)

    var state

    if (isSite) {
      state = 'Location'
      if (isConflict) 
        state += 'Conflict'
      state += (isAlert) ? 'Alert' : (isMissing) ? 'Missing' : (isNormal) ? 'Normal' : 'Empty'
    } else {
      state = 'Device'
      state += (isConflict) ? 'Conflict' : (isAlert) ? 'Alert' : (isMissing) ? 'Missing' : 'Normal'
    }
    return state

  } 

  var row
  var thing
  var searchPriority

  for each(row in agg.rows) {
    searchPriority = (row.MIN_TypePriority === 1) ? 999 : row.MIN_StatePriority
    thing = findByTypeAndState(row.Location, row.MIN_TypePriority, searchPriority)
        
    result.AddRow({
      Thing:        thing.Thing,
      DisplayName:  thing.DisplayName,
      Location:     row.Location,
      State:        findState(row.Location)
    })

  }

  if (!IncludeEmptySites) {
    result = Resources['InfoTableFunctions'].Query({
      query: {
        filters: {
          type: 'NE',
          fieldName: 'State',
          value: 'LocationEmpty'
        }
      },
      t: result
    })
  }
  
} catch (err) {
  logger.error("Error getting Map: " + err)
}