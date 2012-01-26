var bigBangCast,
   bigBangCastXML = <cast />,
   castCount,
   i=0,
   result;

bigBangCast = [
	{ 
		firstName: "Leonard",
		lastName: "Hofstadter",
		degree: "PHD",
		profession: "experimental physicist",
		iq: "173"
	},
	{
		firstName: "Sheldon",
		lastName: "Cooper",
		degree: "PHD",
		profession: "theoretical physicist",
		iq: "187"
	},
	{
		firstName: "Penny",
		profession: "waitress"
	},
	{
		firstName: "Howard",
		lastName: "Wolowitz",
		degree: "MEng",
		profession: "aerospace engineer"
	},
	{
		firstName: "Rajesh",
		lastName: "Koothrappali",
		degree: "PHD",
		profession: "particle astrophysicist"
	}]; 

castCount = bigBangCast.length;

bigBangCastXML = <cast><person></person></cast>;

for (i; i<castCount; i++) {

	var member = bigBangCast[i],
	   fullName = member.firstName + (member.lastName ? (' ' + member.lastName) : '');
	
	bigBangCastXML.person[i] = <person />;
	bigBangCastXML.person[i].fullName = <fullName>{fullName}</fullName>;
	
	if (member.profession) {
		bigBangCastXML.person[i].profession = member.profession;
	}
	if (member.degree) {
		bigBangCastXML.person[i].degree = member.degree;
	}
	if (member.iq) {
		bigBangCastXML.person[i].@iq = member.iq;
	}

}

result = bigBangCastXML;
