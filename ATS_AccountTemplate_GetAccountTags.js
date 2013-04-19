var entities, vocabularies, result
var v

result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
	infoTableName : 'InfoTable',
	dataShapeName : 'EntityList'
})

entities = Resources['SearchFunctions'].SearchModelTags({
  tags: 'ATSAccounts:' + me.name, 
  types: "ModelTagVocabulary"
})

vocabularies = Resources['InfoTableFunctions'].Query({
  t: entities,
  query: {
    filters: {
      type: 'EQ',
      fieldName: 'type',
      value: 'ModelTagVocabulary'
    }
  }
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
