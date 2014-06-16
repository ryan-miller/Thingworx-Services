var xmlLot = SerialNumberList.rows[0].LotNumber;
 
var product = Things['EventRepositoryDatabase'].GetSerialNumberBySerialNumber({
  identifier_type: EventItem.IdentifierType,
  identifier: EventItem.Identifier,
  serial_number: EventItem.SerialNumber
});

var dbLot = product.lot_number;

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
if (isNullOrEmpty(xmlLot)) {
  
  if (isNullOrEmpty(dbLot)) {

    // generate and store exception (5)
    me.LogEventItemException({
      EventItem: EventItem,
      ExceptionCode: 5
    })
        
  }
  
} else {
  
  if (isNullOrEmpty(dbLot)) {
    
    // update db with xmlLot
    // result: NUMBER
    
    try {
      Things["EventRepositoryDatabase"].UpdateProductSerialNumberLotNumber({
        identifier: EventItem.Identifier,
        identifier_type: EventItem.IdentifierType,
        serial_number: EventItem.SerialNumber,
        lot_number: xmlLot
      });
    
    } catch (ex) {
      
      logger.error('Could not update lot number.' + ex);
      
    }

  } else {
    
    if (dbLot !== xmlLot) {
      
      // generate and store exception (5?)
      
      me.LogEventItemException({
        EventItem: EventItem,
        ExceptionCode: 5
      });
    
    }
  } 
}