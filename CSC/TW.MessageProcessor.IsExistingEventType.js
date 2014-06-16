var exceptionFound = false;

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

var GLNMatch = function () {
  
  return (filtered.getRowCount() > 0);
  
};

var ValidSerialNumber = function () {
  
  var found = false;
  
  for each (var row in filtered.rows) {
    if (row.from <= EventItem.SerialNumber && EventItem.SerialNumber <= row.to) {
      found = true;
      break;
    }
    
  }
  
  return found;
  
};

var logException = function (code) {
  
  exceptionFound = true;
  
  me.LogEventItemException({
    EventItem: EventItem,
    ExceptionCode: code
  });
  
}

if (GLNMatch()) {
  
  if (ValidSerialNumber()) {
    
      // continue
      
  } else {
    logException(2);
    
  }
  
} else {
  logException(1);
  
}

var result = exceptionFound;
