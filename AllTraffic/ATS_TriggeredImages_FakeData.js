/*
ts timestamp
ar category tag
ar image type tag
ar picture quality tag
bool retain
get some text comment // http://loripsum.net/api/1/long/plaintext strip to between 10 and 250 chars
thing site
thing device  site5 device2
IMAGES!!!
*/
var i = 0
var randomDate = function (from, to) {
  
  return new Date(from + Math.random() * (to-from))

}

var randomArrayElement = function (a) {

  return a[Math.floor(Math.random() * a.length)]

}

var convertImplementingThingsToArray = function (templateName) {
 
  var things = ThingTemplates[templateName].GetImplementingThings()
  var collection = []
  var row
  for each (row in things.rows) {
    collection.push(row.name)
  }
  return collection

}

var images = (function () {
  
  var images = []
  var prefix = 'TestImage344'
  
  for (var i = 459; i <= 472; i++) {
    images.push(prefix + i)
  }
  for (var j = 497; j <= 509; j++) {
    images.push(prefix + j)
  }
  
  return images
  
})()

var sites = (function () {
  
  //return convertImplementingThingsToArray('ATSSiteTemplate')
  return ['ATSSite3']
})()

var devices = (function () {
  
  //return convertImplementingThingsToArray('ATSDeviceTemplate')
  return ['ATSDevice4']
})()

var categories = ['School Zones', 'Four Lane Highway', 'Two Lane Residential', 'Four Lane Arterial']
var imageTypes = ['Awareness Image', 'Congestion Event', 'High Speed Event', 'Tamper Event']
var imageQuality = ['Suspect', 'Low', 'Medium', 'High']
var retainImage = [true, false]

var comment = function () {

  return Resources['ContentLoaderFunctions'].LoadText({
    url: 'http://loripsum.net/api/1/long/plaintext'
  }).substring(0, Math.floor((Math.random()*250)+12))

}

for (i; i < fakeRecords; i++) {
  
  values = Things['ATSTriggeredImages'].CreateValues()
  values.RetainImage = randomArrayElement(retainImage)
  values.Comments = comment()
  values.SourceDeviceSite = randomArrayElement(sites)
  values.ImageTriggerConditions = randomArrayElement(categories)
  values.ImageType = randomArrayElement(imageTypes)
  values.Resolution = randomArrayElement(imageQuality)
  values.Image = Things['Tester'].TriggeredImage
  
  Things['ATSTriggeredImages'].AddStreamEntry({
    source: randomArrayElement(devices),
    timestamp: randomDate(new Date(2011, 0, 1).getTime(), new Date()),
    values: values
  })
}