var files = me.GetFileListing({
  nameMask: '*',
  path: '/'
});

for each (var file in files.rows) {
  
  var xmlContent = me.LoadXML({
    path: file.path
  });
  
  Things['TW.MessageReceiver'].Receive({
    message: xmlContent
  });
  
  me.DeleteFile({
    path: file.path
  }); 
        
}