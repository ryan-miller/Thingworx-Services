var result, member, fullName, castCount, bigBangCast
var bigBangCastXML = <cast />
var i = 0

// we'll convert this object array to an xml document
bigBangCast = [
	{ 
    iq:         "173",
    degree:     "PHD",
    lastName:   "Hofstadter",
		firstName:  "Leonard",
		profession: "experimental physicist",
		
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
	}
]

castCount = bigBangCast.length;

for (i; i < castCount; i++) {

	member = bigBangCast[i]
	fullName = member.firstName + (member.lastName ? (' ' + member.lastName) : '')
	
	// must create a person element
	bigBangCastXML.person[i] = <person />
	// add fullname element 
	bigBangCastXML.person[i].fullName = <fullName>{fullName}</fullName>
	
	// add option elements and attributes if present
	if (member.profession) {
		bigBangCastXML.person[i].profession = member.profession
	}
	if (member.degree) {
		bigBangCastXML.person[i].degree = member.degree
	}
	if (member.iq) {
		bigBangCastXML.person[i].@iq = member.iq
	}

}

result = bigBangCastXML