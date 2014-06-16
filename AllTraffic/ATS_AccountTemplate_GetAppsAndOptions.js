var device
var devices = me.GetAccountDevices()
var getStatus, getHardwareStatus
var today = new Date()
var oneMonthFromToday = Things['MasterDateServices'].AddDays({
  currentDate: today,
  days: 30
})
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName : "InfoTable",
  dataShapeName : "ATSAppsAndOptionsShape"
})

//TODO: getStatus and getHardwareStatus are too similar to keep separate.
getStatus = function(device, mainFeature, subFeature) {
  var hardwareEnabled   = Things[device][mainFeature + 'Installed']
  var featureEnabled    = Things[device][subFeature + '_Active']
  var featureExpiresOn  = Things[device][subFeature + '_Expiration']

  if (hardwareEnabled) {
    if (featureEnabled) {
      if(featureExpiresOn < today) {
        return "NotSubscribed"
      } else if (featureExpiresOn < oneMonthFromToday) {
        return "ExpiresWithin1Month"
      } else {
        return "Subscribed"
      }
    } else {
      return "NotSubscribed"
    }
  } else {
    return "NotAvailable"
  }

}

getHardwareStatus = function(HardwareFunctionalStatus, IsEnabled, ExpirationDate) { 
  var hardwareEnabled   = Things[device][mainFeature + '_FunctionalStatus']
  var featureEnabled    = Things[device][subFeature + '_Active']
  var featureExpiresOn  = Things[device][subFeature + '_Expiration']

  if (hardwareEnabled) {
    if (featureEnabled) {
      if(featureExpiresOn < today) {
        return "NotSubscribed"
      } else if (featureExpiresOn < oneMonthFromToday) {
        return "ExpiresWithin1Month"
      } else {
        return "Subscribed"
      }
    } else {
      return "NotSubscribed"
    }
  } else {
    return "NotAvailable"
  }
   
} 

for each(device in devices.rows) { 
  result.AddRow({
    DeviceName: Things[device.name].Nickname,
    
    /* TODO: need to address this one-off */
    //PremierCareSubscriptionStatus:          getStatus(true, device.PremierCare_Active, device.PremierCare_Expiration),

    AlertsSubscriptionStatus:               getStatus(device.name, 'Cellular', 'Alerts'),
    BluetoothSubscriptionStatus:            getStatus(device.name, 'BluetoothHardware', 'Bluetooth'),
    LinkingSubscriptionStatus:              getStatus(device.name, 'BluetoothHardware', 'Linking'),
    MapSubscriptionStatus:                  getStatus(device.name, 'Cellular', 'Map'),
    PicturesSubscriptionStatus:             getStatus(device.name, 'Images_Camera', 'Images'),
    RemoteDataSubscriptionStatus:           getStatus(device.name, 'Cellular', 'RDC'),
    RemoteEquipmentMgmtSubscriptionStatus:  getStatus(device.name, 'Cellular', 'REM'),
    RemotePicturesSubscriptionStatus:       getStatus(device.name, 'Cellular', 'RemoteImages')
    
    AuxOutSubscriptionStatus:               getHardwareStatus(device.name, 'AuxOut', 'AuxOut'),
    StrobeSubscriptionStatus:               getHardwareStatus(device.name, 'Strobe', 'Strobe'),
    TrafficDataSubscriptionStatus:          getHardwareStatus(device.name, 'Radar', 'TrafficData')
  })
}
