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

//This service will list all of the Map data
try {
  
  var singleDayInMs = 24 * 60 * 60 * 1000
  var now = new Date()
  var yesterdayInMs = now.getTime() - singleDayInMs
  
  // set up result data
  var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
    infoTableName : "InfoTable",
    dataShapeName : "ATSMapShape"
  })

  // add location info rows
  var addLocationRows = (function () {
    var site

    for each (site in me.GetAccountSites().rows) {
      result.AddRow({
        Name:     site.name, 
        NickName: site.SiteName, 
        Location: site.Location,
        State:    'Location'
      })
    }
  })()

  // add device info rows
  var addDeviceRows = (function () {
    var device
    var recentAlert = false
    var recentLogin = false
    var loginDiffInSec
    var IsConflicted, IsMobile, IsFixed
    var State, MashupName

    for each(device in me.GetAccountDevices().rows){
    
      recentAlert = (device.Alerts_LastAlertTime.getTime() > yesterdayInMs) ? true : false  
    
      // recent Login occurs if lastLoginTime is between now and web_servercontactfrequency ago 
      loginDiffInSec = (now.getTime() - device.LastLogin.getTime()) / (60 * 1000)
      recentLogin = (loginDiffInSec < device.WEB_ServerContactFrequency) ? true : false

      IsConflicted = device.IsConflictedLocation ? true : false

      // devices may not have sites
      if (device.Site === "") 
        IsMobile = false
      else 
        IsMobile = Things[device.Site].IsMobile ? true : false

      IsFixed = !(IsConflicted || IsMobile)

      // build state !order is important
      State = (IsFixed)       ? "Fixed" : 
              (IsMobile)      ? "Mobile" : 
              (IsConflicted)  ? "Conflicted" : ""   
      if (recentLogin) {
        State += "Recent"
      }
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
  
  // filter based on service input query object
  result = Resources['InfoTableFunctions'].Query({
    t: result,
    query: Query
  })

} catch (err) {
  logger.error("Error getting Map: " + err)
}