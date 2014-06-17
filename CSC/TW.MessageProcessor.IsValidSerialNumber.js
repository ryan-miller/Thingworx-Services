var validSerialNumber = true;

var authorizations = Things['EventRepositoryDatabase'].GetAuthorizationsForIdentifierAndType({
  identifier_type: EventItem.IdentifierType,
  identifier: EventItem.Identifier
});

// TODO: MUST CHECK VALID DATES!!!
var filtered = Resources['InfoTableFunctions'].Query({
  
  t: authorizations,
  query: {
    type: 'AND',
    filters: [{
      type: 'EQ',
      fieldName: 'GLNExtension',
      value: EventItem.GLNExtension
    }, {
      type: 'EQ',
      fieldName: 'GLN',
      value: EventItem.GLN
    }]
  }
  
});

var ValidSerialNumber = function () {
	
	var found = false;
	var row;
	
	for each (row in filtered.rows) {
		
		if (row.from <= EventItem.SerialNumber && EventItem.SerialNumber <= row.to) {
			found = true;
			break;
		}
		
	}
	
	return found;
	
};

if (!ValidSerialNumber()) {
	
	validSerialNumber = false;
	
	me.LogEventItemException({
		EventItem: EventItem,
		ExceptionCode: 2
	});

}

var result = validSerialNumber;