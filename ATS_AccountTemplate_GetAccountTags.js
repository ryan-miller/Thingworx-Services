var vocabularies, result
var v

result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
	infoTableName : 'InfoTable',
	dataShapeName : 'EntityList'
})

vocabularies = Resources['EntityServices'].GetEntityList({
  maxItems: 5,
  type: 'ModelTagVocabulary',
  nameMask: me.name + '*'
})

for each (v in vocabularies.rows) {
  result.AddRow({
    name: v.name,
    description: v.description
  })
}

result = Resources['InfoTableFunctions'].Sort({
	sortColumn: 'description',
	t: result
})
