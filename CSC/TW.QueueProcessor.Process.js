//logger.info('Attempting to clear ' + me.name + '.');

var q = Things['TW.MessageQueue'];
var it;

logger.info('There are ' + q.Count() + ' rows in queue');
while (q.Count() > 0) {
  
  it = q.Remove();
  
  logger.warn('next in queue:  from ' + it.rows[0].requester + ': ' + it.rows[0].message );
    
  try {
    // just saving in case we need to reprocess.
    Things["MessageRepo"].SaveXML({
      content: it.rows[0].message,
      path: generateGUID() + '.xml'
    });
    
  } catch (ex) {
    
    logger.error('Could not write to file repo');
    
  }
  
  try {
    
   	Things["TW.MessageProcessor"].Process({
      message: it.rows[0].message
    });
    
  } catch (ex) {
    
    logger.error ('Could not process message from ' + me.name);
    
  }
  
}

logger.info(me.name + ' cleared.');