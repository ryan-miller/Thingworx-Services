var calculateCheckDigit = function (gtin) {
	
	// only for 13 input (or GTIN-14) at the moment
	// this 0652642.800031.400 should equal this 80652642000311
	// check digit here http://www.gs1.org/barcodes/support/check_digit_calculator
	var sum = 0;
	var i = 0;
	var nextMultipleOfTen;
	
	for (i; i < gtin.length; i++) {
		
		if (i % 2 == 0) {
			sum += gtin.charAt(i) * 1;
		} else {
			sum += gtin.charAt(i) * 3;
		}
		
	}
	
	nextMultipleOfTen = Math.ceil(sum / 10) * 10;
	
	return (nextMultipleOfTen - sum);
	
};

var generateGTIN = function(epc) {
	
	var splitAtColon = epc.split(':');
	var splitEpc = splitAtColon[4].split('.');
	var piDigit = splitEpc[1].charAt(0);
	var companyPrefix = splitEpc[0];
	var itemReference = splitEpc[1].substr(1);
	var gtin = piDigit + companyPrefix + itemReference;
	var checkDigit = calculateCheckDigit(gtin);
	var fullGtin = gtin + checkDigit;
	
	return fullGtin;
	
};

// EventType is different. Change from present to past tense.
var getEventTypeForBizStep = function (bizStep) {
  
  // urn:epcglobal:cbv:bizstep:commissioning -> commissioning
  var step = getLastElementFromDelimitedString(bizStep, ':');
  
  if (step === 'encoding')
    return 'encoded';
  else if (step === 'commissioning')
    return 'commissioned';
  else if (step === 'decommissioning')
    return 'decommissioned';
  else
    // throw an exception?
    return 'unknown';
    
};

// just get the last element based on delimiter
var getLastElementFromDelimitedString = function (string, delimeter) {
  return string.substr(string.lastIndexOf(delimeter) + 1);
};

// works with several urn strings (ie, urn:epc:id:sgtin:prefix:reference:other -> prefixreference)
var getPrefixAndReference = function (string) {
  
  var splitOnColon = string.split(':');
  var splitOnPeriod = splitOnColon[4].split('.');
  
  return (splitOnPeriod[0] + splitOnPeriod[1]);
  
};

// grab the events
var eventsXML = message.EPCISBody.EventList.ObjectEvent.epcList.epc;

// create infotable of all other data
var fieldMap = Resources['UniversalConverterFunctions'].CreateMap();
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'Identifier', path: 'epcList'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'BizStep', path: 'bizStep'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'EventId', path: 'eventID'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'Disposition', path: 'disposition'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'ReadPoint', path: 'readPoint.id'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'BizLocation', path: 'bizLocation.id'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'GLN', path: 'readPoint.id'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'GLNExtension', path: 'readPoint.id'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'EventTime', path: 'eventTime'});
Resources['UniversalConverterFunctions'].AddFieldMapping({ map: fieldMap, name: 'EventTimezoneOffset', path: 'eventTimeZoneOffset'});

var flat = Resources['UniversalConverterFunctions'].ConvertXML({
  rowPath: 'EPCISDocument.EPCISBody.EventList.ObjectEvent',
  xml: message,
  fieldMap: fieldMap,
  dataShape: 'TW.EventListInformation'
});

// result infotable stub
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: 'infotable',
  dataShapeName: 'TW.EventListInformation'
});

var epc;

// for each event add to the result infotable
for each (epc in eventsXML) {
  
  result.AddRow({
    // hard coded values
    InsertUser:     'system',
    IdentifierType: 'GTIN',
    
    // specific functionality
    EventType:  getEventTypeForBizStep(flat.rows[0].BizStep),
    
    // get prefix and reference from urn string
    GLN:        getPrefixAndReference(flat.rows[0].GLN),
    //Identifier: getPrefixAndReference(epc),
    Identifier: generateGTIN(epc),
    
    // this is funky. for some reason just adding 'epc' results in 'epc: [null]' in table.
    ProductEpc: epc.split(':').join(':'),
    
    // get the last element from a delimited string (ie, urn:epc:id:sgtin:companyprefix:itemreference:serialnumber -> serialnumber)
    BizStep:      getLastElementFromDelimitedString(flat.rows[0].BizStep, ':'),
    EventId:      getLastElementFromDelimitedString(flat.rows[0].EventId, ':'),
    Disposition:  getLastElementFromDelimitedString(flat.rows[0].Disposition, ':'),
    SerialNumber: getLastElementFromDelimitedString(epc, '.'),
    GLNExtension: getLastElementFromDelimitedString(flat.rows[0].GLNExtension, '.'),
    
    // straight pull, no manipulation
    ReadPoint:            flat.rows[0].ReadPoint,
    BizLocation:          flat.rows[0].BizLocation,
    EventTimezoneOffset:  flat.rows[0].EventTimezoneOffset,
    
    // date with specific format
    EventTime:  dateFormat(flat.rows[0].EventTime, 'yyyy-MM-dd HH:mm:ss'),
    InsertTime: dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
  
  });
  
}
  
