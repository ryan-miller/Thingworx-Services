var fieldMap = Resources['UniversalConverterFunctions'].CreateMap()
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'LotNumber', path: 'lotNumber'})
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'ExpirationDate', path: 'itemExpirationDate'})

var result = Resources['UniversalConverterFunctions'].ConvertXML({
  rowPath: 'EPCISDocument.EPCISBody.EventList.ObjectEvent',
  xml: message,
  fieldMap: fieldMap,
  dataShape: 'TW.SerialNumberInformation'
})