//This service will list all of the Map data
try {
  var singleDay = 24 * 60 * 60 * 1000
  var now = new Date()

  // set up result data
  var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
    infoTableName : "InfoTable",
    dataShapeName : "ATSMapShape"
  })

  // get my account
  var accountInSession = Resources['CurrentSessionInfo'].GetGlobalSessionValues().rows[0].UIAccount
  var myAccount = Things[accountInSession].name

  // get my locations
  var myLocations = (function () {
    var locations = ThingShapes['ATSLocationShape'].GetImplementingThingsWithData()
    return Resources['InfoTableFunctions'].EQFilter({
      fieldName:  "CustomerAccount",
      value:      myAccount,
      t:          locations
    })
  })()

  // add location info rows
  var addLocationRows = (function () {
    var location
    var recentAlert = false
    var diff

    for each (location in myLocations.rows) {

      diff = now.getTime() - location.LastAlert.getTime()
      recentAlert = (diff > singleDay) ? true : false

      result.AddRow({
        Name:     location.name, 
        NickName: location.LocationName, 
        Location: location.Location,
        Tags:     location.tags,
        
        IsLocation:   true,
        IsConflicted: false,
        IsFixed:      false,
        IsLocation:   false,
        IsMobile:     false,
        RecentLogin:  false,
        
        MashupName: "ATSMapLocation",
        State:      "Location",
        
        RecentAlert: recentAlert,
      })
    }
  })()

  // get my devices
  var myDevices = (function () {
    var devices = ThingTemplates['ATSDeviceTemplate'].GetImplementingThingsWithData()
    return Resources['InfoTableFunctions'].EQFilter({
      fieldName:  "CustomerAccount",
      value:      myAccount,
      t:          devices
    })
  })()

  // add device info rows
  var addDeviceRows = (function () {
    var device
    var recentAlert = false
    var recentLogin = false
    var alertDiff, loginDiff
    var IsConflicted, IsMobile, IsFixed
    var State, MashupName

    for each(device in myDevices.rows){

      alertDiff = now.getTime() - device.Alerts_LastAlertTime.getTime()
      recentAlert = (alertDiff > singleDay) ? true : false

      loginDiff =  (now.getTime() - device.LastLogin.getTime()) / (60 * 1000)
      recentLogin = (loginDiff > device.WEB_ServerContactFrequency) ? true : false

      IsConflicted = device.IsConflictedLocation ? true : false

      IsMobile = Things[device.ATSLocation].IsMobile ? true : false

      IsFixed = !(IsConflicted || IsMobile)

      // build state !order is important
      State = (IsFixed)       ? "Fixed" : 
              (IsMobile)      ? "Mobile" : 
              (IsConflicted)  ? "Conflicted" : 
              (recentLogin)   ? "Recent" : ""
      State += device.BaseSignType

      // build mashup !order is important
      MashupName = "ATSMap"
      MashupName += (IsFixed) ? "Fixed" : ""
      MashupName += (IsMobile) ? "Mobile" : ""
      MashupName += (IsConflicted) ? "Conflicted" : ""
      switch (device.BaseSignType) {
        case "S":
          MashupName += "Speed"
          break
        case "M":
          MashupName += "Message"
          break
        default:
      }
      MashupName += "Device"
          
      result.AddRow({   
        Name:         device.name,
        Tags:         device.tags, 
        NickName:     device.Nickname, 
        Location:     device.Location,
        IsConflicted: device.IsConflictedLocation,
        
        IsLocation: false,
        IsLocation: false,
        
        State:        State,
        IsFixed:      IsFixed,
        IsMobile:     IsMobile,
        MashupName:   MashupName,
        RecentAlert:  recentAlert,
        RecentLogin:  recentLogin
      })
    }
  })()

} catch (err) {
  logger.error("Error getting Map: " + err)
}