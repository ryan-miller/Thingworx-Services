var result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape({
  infoTableName: "InfoTable",
  dataShapeName: "ATSMapErrors"
})

var error = {
  Site: SelectedMarkerThing,
  Device: SelectedDevice
}

if (SelectedStatus === 'DeviceConflict') {
  error.Error = 'This sign is more than 500 feet from its assigned Site'
} else if (SelectedStatus === 'DeviceMissing') {
  error.Error = 'This sign has missed its estimated next log in'
}

result.AddRow(error)