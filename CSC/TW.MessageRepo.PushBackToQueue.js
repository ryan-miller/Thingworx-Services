var files = me.GetFileListing({
  nameMask: '*',
  path: '/'
});

var file;
var xmlContent;

for each (file in files.rows) {
  
  xmlContent = me.LoadXML({
    path: file.path
  });
  
  Things['TW.MessageReceiver'].Receive({
    message: xmlContent
  });
  
  me.DeleteFile({
    path: file.path
  }); 
        
}