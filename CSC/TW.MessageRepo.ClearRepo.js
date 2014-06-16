var files = me.GetFileListing({
  nameMask: '*',
  path: '/'
});

for each (var file in files.rows) {
  
  me.DeleteFile({
    path: file.path
  }); 
        
}