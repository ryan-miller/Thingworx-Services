try {
    logger.info('Logging Exception: ' + EventItem.Identifier + ': ' + ExceptionCode);
  Things["EventRepositoryDatabase"].InsertEventException({
    identifier: EventItem.Identifier,
    identifier_type: EventItem.IdentifierType,
    serial_number: EventItem.SerialNumber,
    event_type: EventItem.EventType,
    exception_code: ExceptionCode
  });

} catch (ex) { 
  
  logger.error('Could not log exception.' + ex);

}