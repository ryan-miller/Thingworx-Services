var t = Things[selectedThing]
var thingTemplate = t.thingTemplate
var oneDayInMs = 24 * 60 * 60 * 1000
var now = new Date()
var yesterdayInMs = now.getTime() - oneDayInMs
var isMissing, hasRecentAlert
var getAssignedDevices, getAlertType, getRecentAlert, getDeviceStatus, getMessageForStatus, getActionsForStatus
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: 'InfoTable',
  dataShapeName: 'ATSDeviceLoginAndStatus'
})
var device
var status
getDeviceStatus = function(device) {
  var state
  if (device.IsConflictedWithSiteGPS) {
    state = 'DeviceConflict'
  } else if (hasRecentAlert(device)) {
    state = 'DeviceAlert'
  } else if (isMissing(device)) {
    state = 'DeviceMissing'
  } else {
    state = 'DeviceNormal'
  }
  return state
}

// ENH: load status/messages/Actions as datatable with UI to manage
getActionsForStatus = function(status) {
  var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
    infoTableName: 'InfoTable',
    dataShapeName: 'ATSMapAlertInfo'
  })
  switch (status) {
    case 'DeviceConflict':
      result.AddRow({
        Message: 'Remove from map (not currently deployed)',
        Mashup: 'AppLogViewer'
      })
      break
    case 'DeviceAlert':
      result.AddRow({
        Message: 'Remove from map (not currently deployed)',
        Mashup: 'AppLogViewer'
      })
      result.AddRow({
        Message: 'Add New Site at this GPSLocation',
        Mashup: 'AppLogViewer'
      })
      result.AddRow({
        Message: 'Change Data Collection Site',
        Mashup: 'AppLogViewer'
      })
      break
    case 'DeviceMissing':
      result.AddRow({
        Message: 'Change Data Collection Site',
        Mashup: 'AppLogViewer'
      })
      break
    case 'DeviceNormal':
    default:
  }
  return result
}
getMessageForStatus = function(status) {
  var msg = ''
  switch (status) {
    case 'DeviceConflict':
      msg = 'This sign is more than x feet from its assigned site'
      break
    case 'DeviceAlert':
      msg = 'This sign has an alert'
      break
    case 'DeviceMissing':
      msg = 'This sign has missed its estimated next log in'
      break
    case 'DeviceNormal':
    default:
  }
  return msg
}

getAlertType = function(tags) {
  var type = ''
  var numTags = tags.length
  var i = 0
  for (i; i < numTags; i ++) {
    if (tags[i].vocabulary === 'AlertTypes') {
      type = tags[i].vocabularyTerm
      break
    }
  }
  return type
}

getRecentAlert = function(device) {
  var alertType = ''
  var alertTime = ''
  var alert = ''
  var lastEntry = Things["ATSHistoryAlerts"].QueryStreamEntriesWithData({
    oldestFirst: false,
    query: {
      filters: {
        type: 'EQ',
        fieldName: 'Device',
        value: device
      }
    },
    maxItems: 1
  })

  if (lastEntry.getRowCount() === 1) {
    alertType = getAlertType(lastEntry.tags)
    alertTime = dateFormat(lastEntry.timestamp, 'MM/dd/yy hh:dd')
    alert = alertType + ', ' + alertTime
  }
  return alert
}

isMissing = function(device) {
  return (device.LastLogin.getTime() + (device.WEB_ServerContactFrequency * 60 * 1000)) < now.getTime()
}

hasRecentAlert = function(device) {
  return device.Alerts_LastAlertTime.getTime() > yesterdayInMs
}

getAssignedDevices = (function() {
  var myAccount
  var accountDevices

  myAccount = Resources['CurrentSessionInfo'].GetGlobalSessionValues().rows[0].UIAccount
  // start with all my devices
  accountDevices = Things[myAccount].GetAccountDevices()
  // remove devices that don't have a location defined
  accountDevices = Resources['InfoTableFunctions'].Query({
    t: accountDevices,
    query: {
      filters: {
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
      }
    }
  })
  // remove devices that are cleared from map
  accountDevices = Resources['InfoTableFunctions'].Query({
    t: accountDevices,
    query: {
      filters: {
        type: 'EQ',
        fieldName: 'Site',
        value: selectedThing
      }
    }
  })

  return accountDevices
})()

if (thingTemplate === 'ATSDeviceTemplate') {
  status = getDeviceStatus(t)
  // single device, easy route
  result.AddRow({
    Device: t.name,
    NickName: t.Nickname,
    Status: status,  
    LastLogin: t.LastLogin,
    EstimatedNextLogin: t.EstimatedNextLogin,
    DetailsMashup:'AppLogViewer', // TODO: replace
    RecentAlert: getRecentAlert(t.name), 
    ErrorMessage: getMessageForStatus(status), 
    Actions: getActionsForStatus(status)
  })
} else if (thingTemplate === 'ATSSiteTemplate') {
  // need to find all devices at site, not so easy
  for each (device in getAssignedDevices.rows) {
    status = getDeviceStatus(device)
    result.AddRow({
      Device: device.name,
      NickName: device.Nickname,
      Status: status, 
      LastLogin: device.LastLogin,
      EstimatedNextLogin: device.EstimatedNextLogin,
      DetailsMashup:'AppLogViewer', // TODO: replace
      RecentAlert: getRecentAlert(device.name),
      ErrorMessage: getMessageForStatus(status), 
      Actions: getActionsForStatus(status)
    })
  }
} else {
  logger.error('Map should only display Devices or Sites')
}
