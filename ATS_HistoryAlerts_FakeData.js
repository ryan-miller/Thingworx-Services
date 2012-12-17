var addFakeData = function (entry) {

  var values = me.CreateValues();
  values.Recipients = ""
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
    Threshold: 35,
    ImageID: 0,
    Location: 'ATSLocation1',
    Details: 'None at this time',
    Device: 'ATSDevice1',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:BluetoothFailure'
  },
  {
    Threshold: 50,
    ImageID: 0,
    Location: 'ATSLocation2',
    Details: 'Congestion, see Image',
    Device: 'ATSDevice2',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:Congestion'
  },
  {
    Threshold: 10,
    ImageID: 0,
    Location: 'ATSLocation1',
    Details: 'Tamper, see Image',
    Device: 'ATSDevice1',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:Tamper'
  },
  {
    Threshold: 12,
    ImageID: 0,
    Location: 'ATSLocation1',
    Details: 'None at this time',
    Device: 'ATSDevice1',
    tags: 'Recipients:rmiller;Recipients:jgeiger;AlertTypes:TimeOutOfSync'
  }
]


var fakeDataLength = fakeData.length

for (i; i < fakeDataLength; i++) {
  addFakeData(fakeData[i])
}