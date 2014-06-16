var values = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  dataShapeName: 'TW.MessageInformation',
  infoTableName: 'infotable'
});

try {
  
  logger.info('RECEIVE: adding message to queue: ' + message);
  
  values.AddRow({
    timestamp: new Date(),
    requester: Resources['CurrentSessionInfo'].GetCurrentUser(),
    message: message
  });

  Things['TW.MessageQueue'].Add({
    values: values
  });

} catch (ex) {
  
  logger.error('Could not receive message.');
  
}