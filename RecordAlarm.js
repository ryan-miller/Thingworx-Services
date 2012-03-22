var values;

if (me.InTCVAlarm) {
	
	values = Things['CBMAlarmHistory'].CreateValues();
	values.Condition = "TCV Alarm";
	
	Things['CBMAlarmHistory'].AddStreamEntry({
	   values : values,   	   
	   source : me.name,
   	tags : "CBMAlarmStatuses:OPEN"
   });

}