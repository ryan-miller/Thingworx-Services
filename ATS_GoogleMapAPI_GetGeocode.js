var encodedAddress = encodeURI(Address)
// careful, 'sensor' attribute is required by google api
var url = (me.APIURL + '/geocode/json?sensor=false&address=' + encodedAddress)
var geocodeJSON
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: "InfoTable",
  dataShapeName: "NamedLocation"
})

try {

  geocodeJSON = Resources['ContentLoaderFunctions'].LoadJSON({
    timeout: 60,
    url: url
  })

  // location object also has elevation and units, but not required
  result.AddRow({
    Description: geocodeJSON.results[0].formatted_address,
    Location: {
      longitude: geocodeJSON.results[0].geometry.location.lng, 
      latitude: geocodeJSON.results[0].geometry.location.lat
    }
  })

} catch (e) {

  logger.error('Cannot get geocode: ' + e)

}