export const ParamsSSIDName = (index, value) => {
  return [`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.SSID`, value, 'xsd:string']
}
export const ParamsEnableWifi = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.RadioEnabled`,
    value,
    'xsd:boolean'
  ]
}
export const ParamsAutoChannel = (value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.AutoChannelEnable`,
    value,
    'xsd:boolean'
  ]
}
export const ParamsChannel = (value) => {
  return [`InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Channel`, value, 'xsd:unsignedInt']
}
export const ParamsChannelWidth = (value) => {
  return [
    'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.X_ALU_COM_ChannelWidth',
    value,
    'xsd:unsignedInt'
  ]
}
export const ParamsStandard = (value) => {
  return ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Standard', value, 'xsd:string']
}
export const ParamsTransmitPower = (value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.TransmitPower`,
    value,
    'xsd:unsignedInt'
  ]
}
export const ParamsMaxUser = (value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.X_ALU-COM_VirtualIfCfg_MaxAssoc`,
    value,
    'xsd:unsignedInt'
  ]
}
export const ParamsEnableSSID = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.Enable`,
    value,
    'xsd:boolean'
  ]
}
export const ParamsAdsSSID = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.SSIDAdvertisementEnabled`,
    value,
    'xsd:boolean'
  ]
}
export const ParamsWifiIssolation = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.IsolationEnable`,
    value,
    'xsd:boolean'
  ]
}
export const ParamsBeaconType = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.BeaconType`,
    value,
    'xsd:string'
  ]
}
export const ParamsBasicEncrypt = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.BasicEncryptionModes`,
    value,
    'xsd:string'
  ]
}
export const ParamsWpaEncryptionModes = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.WPAEncryptionModes`,
    value,
    'xsd:string'
  ]
}
export const ParamsKeyPassphrase = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.PreSharedKey.1.KeyPassphrase`,
    value,
    'xsd:string'
  ]
}
export const ParamsBasicAuthMode = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.BasicAuthenticationMode`,
    value,
    'xsd:string'
  ]
}
export const ParamsWepEncryptLevel = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.WEPEncryptionLevel`,
    value,
    'xsd:string'
  ]
}
export const ParamsWepKey = (index, value) => {
  return [
    `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${index}.WEPKey.1.WEPKey`,
    value,
    'xsd:string'
  ]
}
export const ParamsDiagnosticsState = (value) => {
  return [
    'InternetGatewayDevice.X_ALU-COM_NeighboringWiFiDiagnostic.DiagnosticsState',
    value,
    'xsd:string'
  ]
}
