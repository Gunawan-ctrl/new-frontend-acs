import mqtt from 'mqtt'

const mqttModule = {
  client: null,
  connecting: false,
  subscribeSuccess: false,
  retryTimes: 0,

  initData() {
    this.client = null
    this.connecting = false
    this.subscribeSuccess = false
    this.retryTimes = 0
  },

  onReconnect() {
    this.retryTimes += 1
    if (this.retryTimes > 10) {
      try {
        this.client.end()
        this.initData()
        console.error('Connection maxReconnectTimes limit, stop retry')
      } catch (e) {
        console.log(e)
      }
    }
  },

  onMessage(topic, message) {
    try {
      const parseMsg = JSON.parse(message)
      return parseMsg
    } catch (e) {
      console.log('failed to parse massege', e)
    }
  },

  createConnection(connection) {
    try {
      this.connecting = true
      const { protocol, host, port, ...options } = connection
      const connectUrl = `${protocol}://${host}:${port}`
      this.client = mqtt.connect(connectUrl, options)

      if (this.client.on) {
        this.client.on('connect', () => {
          this.connecting = false
        })
        this.client.on('reconnect', this.onReconnect.bind(this))
        this.client.on('error', (err) => {
          console.log('connect mqtt failed', err)
        })
        this.client.on('onffline', () => {
          console.log('client offline')
        })
        this.client.on('close', () => {
          console.log('connection close')
        })
        this.client.on('end', () => {
          console.log('connection end')
        })
        this.client.on('message', this.onMessage.bind(this))
      }
    } catch (e) {
      this.connecting = false
    }
  },

  doSubcribe(subcription) {
    const { topic, qos } = subcription
    this.client.subscribe(topic, { qos }, (error, res) => {
      if (error) {
        console.log('subcribe to topics error :', error)
        return
      }
      this.subscribeSuccess = true
      return res
    })
  },

  destroyConnection() {
    if (this.client && this.client.connected) {
      try {
        this.client.end(false, () => {
          this.initData()
        })
      } catch (e) {
        console.log('disconect failed :', e)
      }
    }
  },
  doUnsubcribe(subscription) {
    const { topic } = subscription
    this.client.unsubscribe(topic, (error) => {
      if (!error) {
        console.log(`Unsubscribed from ${topic}`)
      } else {
        return error
      }
    })
  }
}

export default mqttModule
