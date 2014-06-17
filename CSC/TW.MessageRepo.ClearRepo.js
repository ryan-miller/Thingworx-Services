var files = me.GetFileListing({
  nameMask: '*',
  path: '/'
});

var file;

for each (file in files.rows) {
  
  me.DeleteFile({
    path: file.path
  }); 
        
}