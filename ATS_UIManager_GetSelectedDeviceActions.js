var result = Resources["InfoTableFunctions"].CreateInfoTableFromDataShape({
  infoTableName: "InfoTable",
  dataShapeName: "ATSMapActions"
})

if (SelectedStatus === 'DeviceConflict') {

  result.AddRow({
    Site: SelectedMarkerThing,
    Device: SelectedDevice,
    ActionText: 'Change Data Collection Site',
    ActionLink: ''
  })

  if (Things[SelectedMarkerThing].thingTemplate === 'ATSDeviceTemplate') {
    
    result.AddRow({
      Site: SelectedMarkerThing,
      Device: SelectedDevice,
      ActionText: 'Add new Site at this Location',
      ActionLink: ''
    })

  }

} else if (SelectedStatus === 'DeviceMissing') {

  result.AddRow({
    Site: SelectedMarkerThing,
    Device: SelectedDevice,
    ActionText: 'Remove from map (Not currently deployed)',
    ActionLink: ''
  })

}