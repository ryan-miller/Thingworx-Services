try {
  
  var serialNumberList = me.CreateSerialNumberList({ message: message });
  var eventList = me.CreateEventList({ message: message });
  
  for each (var eventItem in eventList.rows) {
      
    try {
    	
      if (me.IsValidGTIN({EventItem: eventItem})) {
                
        if (me.IsValidSerialNumber({EventItem: eventItem})) {
                  
          if (!me.IsExistingEventType({EventItem: eventItem})) {
			                  
            me.UpdateLotNumber({
              EventItem: eventItem,
              SerialNumberList: serialNumberList
            });
			                  
            me.UpdateExpirationDate({
              EventItem: eventItem,
              SerialNumberList: serialNumberList
            }); 
            
            logger.info('about to register event for event time' + eventItem.EventTime);
            
            me.RegisterEvent({
              GLN: eventItem.GLN,
              BizStep: eventItem.BizStep,
              EventId: eventItem.EventId,
              EventType: eventItem.EventType,
              EventTime: eventItem.EventTime,
              ReadPoint: eventItem.ReadPoint,
              ProductEpc: eventItem.ProductEpc,
              ToLocation: eventItem.ToLocation,
              //InsertTime: eventItem.InsertTime,
              InsertUser: eventItem.InsertUser,
              Identifier: eventItem.Identifier,
              BizLocation: eventItem.BizLocation,
              Disposition: eventItem.Disposition,
              SerialNumber: eventItem.SerialNumber,
              FromLocation: eventItem.FromLocation,
              GLNExtension: eventItem.GLNExtension,
              IdentifierType: eventItem.IdentifierType,
              //LastUpdateTime: eventItem.LastUpdateTime,
              LastUpdateUser: eventItem.LastUpdateUser,
              EventTimezoneOffset: eventItem.EventTimezoneOffset
            });
        
          } else {
            
            logger.info('PROCESS: no existing event type');
            
          }
        
        } else {
          
          logger.info('PROCESS: not a valid serial number');
          
        }
        
      } else {
        
        logger.info('PROCESS: not a valid GTIN');
        
      }

    } catch (ex) {

      logger.error('Could not process event item' + ex);
    
    }
  
  }
  
  
} catch (ex) {
  
  logger.error('Could not process message');
  
} finally {
  
  // place back in the queue?
  // put in error table?

}