Resources['CurrentSessionInfo'].SetGlobalSessionStringValue({ 
  name: "UIAccount",
  value: me.GetPrimaryAccount()
})

Resources['CurrentSessionInfo'].SetGlobalSessionStringValue({
  name: "UIUsername", 
  value: me.GetCurrentUser()
})