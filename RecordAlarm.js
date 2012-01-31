if (me.InTCVAlarm) {
	
	var values, params;
	
	values = Things['CBMAlarmHistory'].CreateValues();
	values.Condition = "TCV Alarm";
	params = {
	   values : values,   	   
	   source : me.name,
   	tags : "CBMAlarmStatuses:OPEN"
   }; 
	
	Things['CBMAlarmHistory'].AddStreamEntry(params);

}