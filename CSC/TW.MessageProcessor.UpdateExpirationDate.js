var xmlDate = SerialNumberList.rows[0].ExpriationDate;
 
var product = Things['EventRepositoryDatabase'].GetSerialNumberBySerialNumber({
  identifier_type: EventItem.IdentifierType,
  identifier: EventItem.Identifier,
  serial_number: EventItem.SerialNumber
});

var dbDate = product.expiration_date;

var isNullOrEmpty = function (v) {
  
  return (v === '' || v === null)
  
}

/*
  null XML    null DB   :   Result
    Y           Y           exception
    Y           N           do nothing
    N           Y           update db with xml
    N           N           exception if XML != DB
*/
if (isNullOrEmpty(xmlDate)) {
  
  if (isNullOrEmpty(dbDate)) {

    // generate and store exception (5)
    me.LogEventItemException({
      EventItem: EventItem,
      ExceptionCode: 5
    })
        
  }
  
} else {
  
  if (isNullOrEmpty(dbDate)) {
    
    // update db with xmlDate
    // result: NUMBER
    
    try {
      Things["EventRepositoryDatabase"].UpdateProductSerialNumberExpirationDate({
        identifier: EventItem.Identifier,
        identifier_type: EventItem.IdentifierType,
        serial_number: EventItem.SerialNumber,
        expiration_date: xmlDate
      });
    
    } catch (ex) {
      
      logger.error('Could not update date.' + ex);
      
    }

  } else {
    
    if (dbDate !== xmlDate) {
      
      // generate and store exception (5?)
      
      me.LogEventItemException({
        EventItem: EventItem,
        ExceptionCode: 5
      });
    
    }
  } 
}