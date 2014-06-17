var validGTIN = true;

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

if (!GLNMatch()) {
  
  validGTIN = false;
  me.LogEventItemException({
    EventItem: EventItem,
    ExceptionCode: 1
  });  
  
}

var result = validGTIN;
