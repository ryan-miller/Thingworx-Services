var addFakeData = function (entry) {

  var values = me.CreateValues();
  values.Threshold  = entry.Threshold
  values.ImageID    = entry.ImageID
  values.Location   = entry.Location
  values.Details    = entry.Details
  values.Device     = entry.Device

  me.AddStreamEntry({
    values : values,
    tags : entry.tags,
    source : "rmiller"
  })

}

var i = 0
var fakeData = [
  {
    Threshold: 30,
    ImageID: '',
    Location: 'ATSLocation1',
    Details: 'None at this time',
    Device: 'ATSDevice2',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:BluetoothFailure'
  },
  {
    Threshold: 50,
    ImageID: '',
    Location: 'ATSLocation5',
    Details: 'Congestion, see Image',
    Device: 'ATSDevice4',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:Congestion'
  },
  {
    Threshold: 10,
    ImageID: '',
    Location: 'ATSLocation4',
    Details: 'Tamper, see Image',
    Device: 'ATSDevice1',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:Tamper'
  },
  {
    Threshold: 12,
    ImageID: '',
    Location: 'ATSLocation',
    Details: 'None at this time',
    Device: 'ATSDevice1',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:TimeOutOfSync'
  }
]


var fakeDataLength = fakeData.length

for (i; i < fakeDataLength; i++) {
  addFakeData(fakeData[i])
}