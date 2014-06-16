var i = 0
var randomArrayValue = function(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
var randomDate = function(from, to) {
    return new Date(from + Math.random() * (to-from));
  }    
var assets = [
  {
    name: "TucsonTransformer1",
    substation: "TucsonSubstation",
    alerts: [
      {
        priority: ["INFORMATION"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 12+ hours since last Nitrogen reading.",
          "It's been 12+ hours since last Oxygen reading."
        ]
      },
      {
        priority: ["WARNING"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 24+ hours since last Nitrogen reading.",
          "CO2 reading has increased more than 125% since last reading."
        ]
      },
      {
        priority: ["HIGH"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "Ambient temperature reading is above threshold.",
          "Pressure reading is above threshold.",
          "Oil temperature reading is above threshold."
        ]
      },
      {
        priority: ["CRITICAL"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "CO2 READING IS CRITICAL",
          "OXYGEN READING IS ABOVE THRESHOLD",
          "OIL TEMPERATURE IS ABOVE THRESHOLD",
          "IT'S BEEN 7 DAYS SINCE THE LAST READING"
        ]
      }
    ]
  },
  {
    name: "TucsonTransformer2",
    substation: "TucsonSubstation",
    alerts: [
      {
        priority: ["INFORMATION"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 12+ hours since last Nitrogen reading.",
          "It's been 12+ hours since last Oxygen reading."
        ]
      },
      {
        priority: ["WARNING"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 24+ hours since last Nitrogen reading.",
          "CO2 reading has increased more than 125% since last reading."
        ]
      },
      {
        priority: ["HIGH"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "Ambient temperature reading is above threshold.",
          "Pressure reading is above threshold.",
          "Oil temperature reading is above threshold."
        ]
      },
      {
        priority: ["CRITICAL"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "CO2 READING IS CRITICAL",
          "OXYGEN READING IS ABOVE THRESHOLD",
          "OIL TEMPERATURE IS ABOVE THRESHOLD",
          "IT'S BEEN 7 DAYS SINCE THE LAST READING"
        ]
      }
    ]
  },
  {
    name: "TucsonTurbine1",
    substation: "TucsonSubstation",
    alerts: [
      {
        priority: ["INFORMATION"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 12+ hours since last Key Phasor reading.",
          "It's been 12+ hours since last Head Cover Accelerator reading."
        ]
      },
      {
        priority: ["WARNING"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "It's been 24+ hours since last Key Phasor reading.",
          "Head Cover Accelerator reading has increased more than 125% since last reading."
        ]
      },
      {
        priority: ["HIGH"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "Key Phasor reading is above threshold.",
          "Upper East Airgap reading is above threshold.",
          "Lower South Airgap reading is above threshold."
        ]
      },
      {
        priority: ["CRITICAL"],
        status: ["OPEN","ACTIVE","CLOSED"],
        condition: [
          "KEY PHASOR IS CRITICAL",
          "UPPER EAST AIRGAP IS ABOVE THRESHOLD",
          "LOWER SOUTH AIRGAP IS ABOVE THRESHOLD",
          "IT'S BEEN 7 DAYS SINCE THE LAST READING"
        ]
      }
    ]
  }
]
var fakeAsset, fakeAlert, values
    
for (i; i < rows; i++) {
  fakeAsset = randomArrayValue(assets); 
  fakeAlert = randomArrayValue(fakeAsset.alerts);
  
  values = Things['SubstationAlarmHistory'].CreateValues();
  values.Substation  = fakeAsset.substation;
  values.Priority    = randomArrayValue(fakeAlert.priority);
  values.Condition   = randomArrayValue(fakeAlert.condition);
  values.Status      = randomArrayValue(fakeAlert.status);

  Things['SubstationAlarmHistory'].AddStreamEntry({
    source:     fakeAsset.name,
    values:     values,
    timestamp:  randomDate(new Date(2011,0,1).getTime(), new Date())
  })
}