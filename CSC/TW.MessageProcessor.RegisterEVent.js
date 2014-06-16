logger.info('registering event for ' + EventTime );
try {
  
  var result = Things["EventRepositoryDatabase"].InsertEventData({
    BizStep: BizStep,
    EventTimezoneOffset: EventTimezoneOffset,
    EventId: EventId,
    Disposition: Disposition,
    IdentifierType: IdentifierType,
    EventType: EventType,
    //LastUpdateTime: LastUpdateTime,
    ProductEpc: ProductEpc,
    SerialNumber: SerialNumber,
    GLN: GLN,
    FromLocation: FromLocation,
    ToLocation: ToLocation,
    //InsertTime: InsertTime,
    EventTime: EventTime,
    BizLocation: BizLocation,
    Identifier: Identifier,
    ReadPoint: ReadPoint,
    LastUpdateUser: LastUpdateUser,
    InsertUser: InsertUser,
    GLNExtension: GLNExtension
  });
    
  logger.info('updated ' + result + ' rows');

} catch(ex) {
  
  logger.error('Could not insert event... ' + ex);
  
}
