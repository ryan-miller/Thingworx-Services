var glycolHigh = me.GlycolControlValve > 1 ? true : false,
   glycolLow = me.GlycolControlValve < 1 ? true : false,
   waterHigh = me.WaterControlValve > 1 ? true : false,
   waterLow = me.WaterControlValve < 1 ? true : false;

// one should near 0 while the other is open, else alarm it.
if ((glycolLow && waterLow) || (glycolHigh && waterHigh)) {
   if (!me.InTCVAlarm) {
      me.InTCVAlarm = true;
   }
} else { 
   if (me.InTCVAlarm) {
      me.InTCVAlarm = false;
   }
}
      
