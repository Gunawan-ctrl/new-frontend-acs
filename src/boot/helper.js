import { Modal } from 'ant-design-vue'
import format from 'date-fns/format'
import id from 'date-fns/locale/id'

export const modalConfirm = (title, paramsValue, paramsName, onSubmit) => {
  Modal.confirm({
    title: title,
    async onOk() {
      const data = {
        name: paramsValue,
        parameterNames: [paramsName]
      }
      onSubmit(data)
    }
  })
}
export const convertTime = (date) => {
  return format(new Date(date), ` d MMM yyyy,  HH:mm`, {
    locale: id
  })
}
export const subnetInfo = (subnetMask) => {
  const maskPart = subnetMask
    .split('.')
    .map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
  const binaryMask = maskPart.join('')
  const networkBits = binaryMask.split('1').length - 1

  console.log(networkBits)
  return networkBits
}
export const mapSSIDNumb = (tabA, tabB, bandwidth) => {
  const ssidTabA = tabA.map((item) => item.ssidNumber)
  const ssidTabB = tabB.map((item) => item.ssidNumber)
  if (bandwidth == '2.4') return ssidTabA
  else return ssidTabB
}
export const informMinutes = (date) => {
  const now = new Date()
  const threeMinutes = now - 3 * 60 * 1000
  // const tomorow = now.getTime() + 24 * 60 * 60 * 1000

  if (date > threeMinutes) return 'online'
  else return 'past 24 hours'
  // if (date > tomorow && date < threeMinutes) return 'past 24 hours'
  // else return 'others'
}

export const objectToArray = (obj, arr) => {
  for (const key in obj) {
    if (obj.hasOwnProperty) {
      arr.push(obj[key])
    }
  }
  return arr
}
export const secondToMinute = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes} minute(s) and ${remainingSeconds} second(s)`
}

export const adjustOpacity = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r},${g},${b},${alpha})`
}
export const mapColumnNeighbour = (manufacture, column) => {
  let temp = []
  if (manufacture == 'Huawei Technologies Co., Ltd') {
    temp = [
      {
        title: column[5],
        dataIndex: column[5],
        key: column[5]
      },
      {
        title: column[3],
        dataIndex: column[3],
        key: column[3]
      },
      {
        title: column[4],
        dataIndex: column[4],
        key: column[4]
      },
      {
        title: column[1],
        dataIndex: column[1],
        key: column[1]
      },
      {
        title: column[6],
        dataIndex: column[6],
        key: column[6]
      },
      {
        title: column[7],
        dataIndex: column[7],
        key: column[7]
      }
    ]
  } else if (manufacture == 'ALCL') {
    temp = [
      {
        title: column[6],
        dataIndex: column[6],
        key: column[6]
      },
      {
        title: column[1],
        dataIndex: column[1],
        key: column[1]
      },
      {
        title: column[2],
        dataIndex: column[2],
        key: column[2]
      },
      {
        title: 'Operating Channel Bandwith',
        dataIndex: column[3],
        key: column[3]
      },
      {
        title: 'Operating Standart',
        dataIndex: column[4],
        key: column[4]
      },
      {
        title: 'Security Mode',
        dataIndex: column[7],
        key: column[7]
      },
      {
        title: 'Signal Strength',
        dataIndex: column[8],
        key: column[8]
      },
      {
        title: 'Supported Standards',
        dataIndex: column[9],
        key: column[9]
      }
    ]
  }
  return temp
}
export const convertChannelToFrequency = (channel) => {
  if (channel >= 1 && channel <= 13) {
    return 2412 + (channel - 1) * 5
  } else if (channel === 14) {
    return 2484
  } else if (channel === 15) {
    return 2500
  } else {
    return null // Channel tidak sesuai
  }
}

export const convertFrequencyToChannel = (frequency) => {
  if (frequency >= 2412 && frequency <= 2472) {
    return 1 + Math.floor((frequency - 2412) / 5)
  } else if (frequency === 2484) {
    return 14
  } else if (frequency === 2500) {
    return 15
  } else {
    return 0 // Frekuensi tidak sesuai
  }
}
export const convertChannelToFrequency5GHz = (channel) => {
  if (channel >= 36 && channel <= 165) {
    return channel * 5 + 5000
  } else {
    return null // Channel tidak valid untuk 5 GHz
  }
}
export const convertFrequencyToChannel5GHz = (frequency) => {
  if (frequency == 5000) {
    return 35
  } else {
    return (frequency - 5000) / 5
  }
}
export const mapDataSetChart = (data, manufacture) => {
  let dataX = null
  let dataY = null
  let channelBandwidth = null

  const xIndex0 = (xValue, frequency) => {
    let freq = parseInt(frequency)
    if (freq == 20) {
      return xValue - (freq / 2 + 1)
    } else {
      return xValue - (freq / 2 + 2)
    }
  }
  const xIndex1 = (xValue, frequency) => {
    let freq = parseInt(frequency)
    if (freq == 20) {
      return xValue + (freq / 2 + 1)
    } else {
      return xValue + (freq / 2 + 2)
    }
  }

  if (manufacture == 'ALCL') {
    data.map((item) => {
      dataY = item?.SignalStrength
      dataX = item?.Channel
      channelBandwidth = item?.OperatingChannelBandwidth
      item.dataset = [
        { x: xIndex0(convertChannelToFrequency(dataX), channelBandwidth), y: -100 },
        { x: convertChannelToFrequency(dataX), y: dataY },
        { x: xIndex1(convertChannelToFrequency(dataX), channelBandwidth), y: -100 }
      ]
    })
    return data
  }
}
export const mapDataSetChart5Ghz = (data, manufacture) => {
  let dataX = null
  let dataY = null
  let channelBandwidth = null

  const xIndex0 = (xValue, frequency) => {
    let freq = parseInt(frequency)
    return xValue - freq / 2
  }
  const xIndex1 = (xValue, frequency) => {
    let freq = parseInt(frequency)
    return xValue + freq / 2
  }

  if (manufacture == 'ALCL') {
    data.map((item) => {
      dataY = item?.SignalStrength
      dataX = item?.Channel
      channelBandwidth = item?.OperatingChannelBandwidth

      item.dataset = [
        { x: xIndex0(convertChannelToFrequency5GHz(dataX), channelBandwidth), y: -100 },
        { x: convertChannelToFrequency5GHz(dataX), y: dataY },
        { x: xIndex1(convertChannelToFrequency5GHz(dataX), channelBandwidth), y: -100 }
      ]
    })
    return data
  }
}
export const mapDataWanStats = (data, manufacture) => {
  let keyObj = []
  let title = {}

  if (manufacture == 'ALCL') {
    keyObj = Object.keys(data)
    title = Object.assign({}, keyObj)
    title[1] = 'Ethernet Broadcast Packets Received'
    title[2] = 'Ethernet Broadcast Packets Sent'
    title[3] = 'Ethernet Bytes Received'
    title[4] = 'Ethernet Bytes Sent'
    title[5] = 'Ethernet Discard Packets Received'
    title[6] = 'Ethernet Discard Packets Sent'
    title[7] = 'Ethernet Errors Received'
    title[8] = 'Ethernet Errors Sent'
    title[9] = 'Ethernet Multicast Packets Received'
    title[10] = 'Ethernet Multicast Packets Sent'
    title[11] = 'Ethernet Packets Received'
    title[12] = 'Ethernet Packets Sent'
    title[13] = 'Ethernet Unicast Packets Received'
    title[14] = 'Ethernet Unicast Packets Sent'
    title[15] = 'Ethernet Unknown Proto Packets Received'
    title[16] = 'CRC Error Received'
    title[17] = 'CRC Error Sent'
    title[18] = 'Down Stream Bw Utilization'
    title[19] = 'Down Stream Fragments'
    title[20] = 'Down Stream Jabbers'
    title[21] = 'Over Size Packets Received'
    title[22] = 'Over Size Packets Sent'
    title[23] = 'Under Size Packets Received'
    title[24] = 'Under Size Packets Sent'
    title[25] = 'Up Stream Bw Utilization'
    title[26] = 'Up Stream Fragments'
    title[27] = 'Up Stream Jabbers'
    title[28] = 'Packets Dropped'
    title[29] = 'Packets Errored'
    title[30] = 'Packets Received Broadcast'
    title[31] = 'Packets Received Multicast'
    title[32] = 'Packets Received Unicast'
    title[33] = 'Packets Sent Broadcast'
    title[34] = 'Packets Sent Multicast'
    title[35] = 'Packets Sent Unicast'
    return title
  } else if (manufacture == 'Huawei Technologies Co., Ltd') {
    keyObj = Object.keys(data)
    title = Object.assign({}, keyObj)
    title[1] = 'Ethernet Broadcast Packets Received'
    title[2] = 'Ethernet Broadcast Packets Sent'
    title[3] = 'Ethernet Bytes Received'
    title[4] = 'Ethernet Bytes Sent'
    title[5] = 'Ethernet Discard Packets Received'
    title[6] = 'Ethernet Discard Packets Sent'
    title[7] = 'Ethernet Errors Received'
    title[8] = 'Ethernet Errors Sent'
    title[9] = 'Ethernet Multicast Packets Received'
    title[10] = 'Ethernet Multicast Packets Sent'
    title[11] = 'Ethernet Packets Received'
    title[12] = 'Ethernet Packets Sent'
    title[13] = 'Ethernet Unicast Packets Received'
    title[14] = 'Ethernet Unicast Packets Sent'
    title[15] = 'Ethernet Unknown Proto Packets Received'
    title[16] = 'Ethernet Bytes Received High'
    title[17] = 'Ethernet Bytes Received Low'
    title[18] = 'Ethernet Bytes Sent High'
    title[19] = 'Ethernet Bytes Sent Low'
    return title
  }
}
export const mapWlan = (params) => {
  const temp = [
    {
      title: 'WiFi Name',
      value: params.SSID
    },

    {
      title: 'Enable WiFi',
      value: null
    },
    {
      title: 'WiFi Broadcast',
      value: null
    },
    {
      title: 'WiFi Issolation',
      value: null
    },
    {
      title: 'Channel In Use',
      value: params.ChannelsInUse
    },
    {
      title: 'Setting Auth WiFi',
      value: null
    }
  ]
  return temp
}
export const getConfigValue = (res, index, path) => {
  return res.InternetGatewayDevice.LANDevice[1].WLANConfiguration[index][path]._value
}
