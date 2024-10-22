<template>
  <main class="bg-white shadow-sm rounded-md">
    <SpinLoading :loading="isLoading" />
    <section>
      <FormTaskDevice
        :title="'Update WiFi Name'"
        :open="isModal.openWifi"
        :value="form.wifiNameValue"
        @onInput="onInputWifiName"
        @onSubmit="onSubmitWIfi"
        @onCancel="onCancelWifi"
      />
      <FormWifiAuth
        :isOpen="isModal.openWifiPass"
        :isLoading="loadTask"
        :encryptMode="form.encrytpModeValue"
        :beaconTypeValue="form.beaconTypeValue"
        :wpaEncryptMode="form.wpaEncryptModeValue"
        :wpaKey="form.wpaKeyValue"
        :arrayWpaEncryptMode="arrayWpaEncryptMode"
        :wepEncryptionLevel="form.wepEncryptLvValue"
        :basicAuthMode="form.basicAuthModeValue"
        :wepKey="form.wepKeyValue"
        :bandwidth="bandwidth"
        @onCancel="onCancelAuth"
        @onSubmit="onSubmitAuth"
        @onEncryptMode="onEncryptMode"
        @onWpaEncryptMode="onWpaEncryptMode"
        @onSelectBeaconType="onSelectBeaconType"
        @inputWpaKey="inputWpaKey"
        @onWepEncryptLevel="onWepEncryptLevel"
        @onBasicAuthMode="onBasicAuthMode"
        @inputWepKey="inputWepKey"
      />
    </section>
    <section>
      <div
        class="px-4 py-2 flex flex-row sm:flex-nowrap flex-wrap gap-1 items-center justify-between"
      >
        <h1 class="font-medium">Information Wi-Fi</h1>
        <a-radio-group
          v-model:value="bandwidth"
          @change="onBandwidth(bandwidth)"
          button-style="solid"
          size="small"
        >
          <a-radio-button value="2.4">2.4 GHz</a-radio-button>
          <a-radio-button value="5">5 GHz</a-radio-button>
        </a-radio-group>
      </div>
    </section>
    <hr class="my-1" />
    <section>
      <div class="pt-2 px-8 flex flex-col gap-y-2">
        <div class="flex flex-row items-center gap-x-4 justify-between">
          <h1>Enable</h1>
          <a-switch
            @change="onEnableWifi"
            v-model:checked="form.enabelWifiValue"
            checked-children="on"
            un-checked-children="off"
            size="small"
          />
        </div>
        <div class="flex flex-row items-center gap-x-4 justify-between" v-if="bandwidth == '2.4'">
          <h1>Mode</h1>
          <a-select @change="onSelectMode" class="w-24" size="small" v-model:value="form.modeValue">
            <a-select-option v-for="item in arrayMode" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row items-center gap-x-4 justify-between">
          <h1>Bandwidth</h1>
          <a-select
            @change="onSelectBandwidth"
            class="w-28"
            size="small"
            v-model:value="form.bandwidthValue"
          >
            <a-select-option v-for="(item, i) in arrayBandwidth" :key="i" :value="i">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row items-center gap-x-4 justify-between">
          <h1>Channel</h1>
          <a-select
            @change="onSelectChannel"
            class="w-24"
            size="small"
            v-model:value="form.channelValue"
          >
            <a-select-option v-for="(item, i) in arrayChannel" :key="item" :value="i">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row items-center gap-x-4 justify-between">
          <h1>Transmiting Power</h1>
          <a-select
            @change="onSelectTransmit"
            class="w-24"
            size="small"
            v-model:value="form.transMitValue"
          >
            <a-select-option v-for="item in arrayTransmit" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row items-center gap-x-4 justify-between">
          <h1>Max Users</h1>
          <a-select
            @change="onSelectMaxUsr"
            class="w-24"
            size="small"
            v-model:value="form.maxUserValue"
          >
            <a-select-option v-for="item in arrayMaxUser" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </section>
    <hr class="mt-3" />
    <section>
      <div class="px-4 py-2">
        <TabPanel :tabProps="bandwidth == '5' ? tabDataB : tabDataA" @onTab="onTab" />
      </div>
    </section>
    <section>
      <div class="px-4 py-2">
        <TableWifi
          :dataTable="dataTable"
          @onEnableSSID="onEnableSSID"
          @onTaskWifi="onTaskWifi"
          @onEnableWifiBroadcast="onEnableWifiBroadcast"
          @onEnableIssolation="onEnableIssolation"
          @onAuthWifi="onAuthWifi"
        />
      </div>
    </section>
    <section>
      <div class="flex flex-row justify-end py-3 px-4">
        <a-button
          size="small"
          type="primary"
          @click="onSubmit"
          :disabled="
            params.paramsEnable ||
            params.paramsStandart ||
            params.paramsChannelWidth ||
            params.paramsChannel ||
            params.paramsAutoChannel ||
            params.paramstrasnmitPower ||
            params.paramsMaxUsr ||
            params.paramsEnableSSID ||
            params.paramsEnableWifibroadcast ||
            params.paramsEnableWifiIssolation
              ? false
              : true
          "
          >submit</a-button
        >
      </div>
    </section>
  </main>
</template>

<script>
import { getDetailDeviceAcs, taskGenie } from '@/boot/hooks'
import TabPanel from '../Tab/TabPanel.vue'
import SpinLoading from '../Spin/SpinLoading.vue'
import FormTaskDevice from '../Form/FormTaskDevice.vue'
import { message } from 'ant-design-vue'
import { getConfigValue, mapWlan } from '@/boot/helper'
import { split } from 'postcss/lib/list'
import TableWifi from '../Table/TableWifi.vue'
import FormWifiAuth from '../Form/FormWifiAuth.vue'
import {
  ParamsAdsSSID,
  ParamsAutoChannel,
  ParamsChannel,
  ParamsChannelWidth,
  ParamsEnableSSID,
  ParamsEnableWifi,
  ParamsMaxUser,
  ParamsSSIDName,
  ParamsStandard,
  ParamsTransmitPower,
  ParamsWifiIssolation,
  ParamsBeaconType,
  ParamsKeyPassphrase,
  ParamsWpaEncryptionModes,
  ParamsBasicAuthMode,
  ParamsWepEncryptLevel,
  ParamsWepKey,
  ParamsBasicEncrypt
} from '@/boot/parameters'

export default {
  components: {
    TabPanel,
    SpinLoading,
    TableWifi,
    FormTaskDevice,
    FormWifiAuth
  },
  data: () => ({
    loadTask: false,
    isLoading: false,
    isModal: {
      openWifi: false,
      openWifiPass: false
    },
    form: {
      enabelWifiValue: null,
      wifiPassValue: null,
      channelValue: null,
      wifiNameValue: null,
      enableSSIDValue: null,
      wifiBroadcast: null,
      modeValue: null,
      bandwidthValue: null,
      transMitValue: null,
      maxUserValue: null,
      wifiIssolationValue: null,
      // auth wifi
      basicAuthModeValue: null,
      encrytpModeValue: null,
      beaconTypeValue: null,
      wpaEncryptModeValue: null,
      wpaKeyValue: null,
      wepEncryptLvValue: null,
      wepKeyValue: ''
    },
    params: {
      paramsEnable: null,
      paramsStandart: null,
      paramsChannelWidth: null,
      paramsChannel: null,
      paramsAutoChannel: null,
      paramstrasnmitPower: null,
      paramsMaxUsr: null,
      paramsEnableSSID: null,
      paramsEnableWifibroadcast: null,
      paramsEnableWifiIssolation: null,
      // auth wifi

      paramsEncryptMode: null,
      paramsBeaconType: null,
      paramsWpaEncryptMode: null,
      paramsWpaKey: null,
      paramsBasicAuthMode: null,
      paramsWepLv: null,
      paramsWepKey: null
    },
    bandwidth: '2.4',
    tabPanelValue: '1',
    idParams: null,
    idDevice: null,

    dataTable: [],
    titleData: [
      { name: 'wireless status' },
      { name: 'wireless channel' },
      { name: 'WPA Authentication Mode' },
      { name: 'WPA Encryption Mode' },
      { name: 'packet drop' },
      { name: 'packet error' },
      { name: 'power transmision' },
      { name: 'power transmision support' },
      { name: 'device connected' },
      { name: 'mode' }
    ],
    tabDataA: [],
    tabDataB: [],
    arrayChannel: [],
    arrayMode: [],
    arrayBandwidth: [],
    arrayTransmit: [],
    arrayMaxUser: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32
    ],
    arrayWpaEncryptMode: []
  }),
  methods: {
    filterData(data, value) {
      const res = data.filter((item) => value === item.ssidNumber)
      return res
    },
    clearFormAuth() {
      this.form = {
        ...this.form,
        basicAuthModeValue: null,
        encrytpModeValue: null,
        beaconTypeValue: null,
        wpaEncryptModeValue: null,
        wpaKeyValue: null,
        wepEncryptLvValue: null
      }
    },
    clearParamsAuth() {
      this.params = {
        ...this.params,
        paramsEncryptMode: null,
        BeaconType: null,
        paramsWpaEncryptMode: null,
        paramsWpaKey: null,
        paramsBasicAuthMode: null,
        paramsWepLv: null,
        paramsWepKey: null
      }
    },
    formEditable(res) {
      this.form = {
        ...this.form,
        enabelWifiValue: getConfigValue(res.data[0], this.tabPanelValue, 'RadioEnabled'),
        channelValue: getConfigValue(res.data[0], this.tabPanelValue, 'Channel'),
        modeValue: getConfigValue(res.data[0], this.tabPanelValue, 'Standard'),
        bandwidthValue: getConfigValue(res.data[0], this.tabPanelValue, 'X_ALU_COM_ChannelWidth'),
        transMitValue: getConfigValue(res.data[0], this.tabPanelValue, 'TransmitPower'),
        maxUserValue: getConfigValue(
          res.data[0],
          this.tabPanelValue,
          'X_ALU-COM_VirtualIfCfg_MaxAssoc'
        ),
        wifiNameValue: getConfigValue(res.data[0], this.tabPanelValue, 'SSID'),
        enableSSIDValue: getConfigValue(res.data[0], this.tabPanelValue, 'Enable'),
        wifiBroadcast: getConfigValue(res.data[0], this.tabPanelValue, 'SSIDAdvertisementEnabled'),
        wifiIssolationValue: getConfigValue(res.data[0], this.tabPanelValue, 'IsolationEnable')
      }
    },
    async getDetailAuthWifi() {
      this.loadTask = true
      await getDetailDeviceAcs(this.idParams)
        .then((res) => {
          const resTemp = res.data[0].InternetGatewayDevice
          this.form = {
            ...this.form,
            beaconTypeValue: getConfigValue(res.data[0], this.tabPanelValue, 'BeaconType'),
            wpaEncryptModeValue: getConfigValue(
              res.data[0],
              this.tabPanelValue,
              'WPAEncryptionModes'
            )
          }

          if (this.form.beaconTypeValue?.search('11i') !== -1) {
            //wpa
            this.form = {
              ...this.form,
              encrytpModeValue: 'WPA/WPA2',
              wpaKeyValue:
                resTemp.LANDevice[1].WLANConfiguration[this.tabPanelValue].PreSharedKey[1]
                  .KeyPassphrase._value
            }
            this.params = {
              ...this.params,
              paramsBeaconType: ParamsBeaconType(this.tabPanelValue, this.form.beaconTypeValue),
              paramsWpaEncryptMode: ParamsWpaEncryptionModes(
                this.tabPanelValue,
                this.form.wpaEncryptModeValue
              ),
              paramsWpaKey: ParamsKeyPassphrase(this.tabPanelValue, this.form.wpaKeyValue)
            }
          } else {
            //wep
            this.form.encrytpModeValue = getConfigValue(
              res.data[0],
              this.tabPanelValue,
              'BasicEncryptionModes'
            )

            if (this.form.basicAuthModeValue != 'None' && this.form.wepKeyValue != null) {
              this.form = {
                ...this.form,
                basicAuthModeValue: getConfigValue(
                  res.data[0],
                  this.tabPanelValue,
                  'BasicAuthenticationMode'
                ),
                wepEncryptLvValue: getConfigValue(
                  res.data[0],
                  this.tabPanelValue,
                  'WEPEncryptionLevel'
                ),
                wepKeyValue:
                  resTemp.LANDevice[1].WLANConfiguration[this.tabPanelValue].WEPKey[1].WEPKey._value
              }
              this.params = {
                ...this.params,
                paramsEncryptMode: ParamsBasicEncrypt(
                  this.tabPanelValue,
                  this.form.encrytpModeValue
                ),
                paramsBasicAuthMode: ParamsBasicAuthMode(
                  this.tabPanelValue,
                  this.form.basicAuthModeValue
                ),
                paramsWepLv: ParamsWepEncryptLevel(this.tabPanelValue, this.form.wepEncryptLvValue),
                paramsWepKey: ParamsWepKey(this.tabPanelValue, this.form.wepKeyValue)
              }
            }
          }

          this.form.beaconTypeValue === 'WPAand11i'
            ? (this.arrayWpaEncryptMode = [{ name: 'TKIP/AES', value: 'TKIPandAESEncryption' }])
            : (this.arrayWpaEncryptMode = [{ name: 'AES', value: 'AESEncryption' }])
        })
        .catch((err) => {
          this.loadTask = true
          console.log(err)
        })
        .finally(() => (this.loadTask = false))
    },
    onTaskWifi(value) {
      this.form.wifiNameValue = value
      this.isModal.openWifi = true
    },
    onCancelWifi() {
      this.isModal.openWifi = false
      this.form.wifiNameValue = null
    },
    onInputWifiName(value) {
      this.form.wifiNameValue = value
    },
    async getData() {
      this.idParams = this.$route.params.id
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)
        const tempData = JSON.parse(res.data[0].VirtualParameters.WLANAll._value)

        this.idDevice = res.data[0]._id
        this.dataTable = mapWlan(tempData[0])

        if (this.bandwidth == '2.4') {
          const tempSplitChnnl = split(
            res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1].PossibleChannels
              ._value,
            ';'
          )
          const suppModeTemp =
            res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1].SupportedStandards
              ._value

          this.arrayChannel = ['auto', ...split(tempSplitChnnl[0], ',')]

          this.arrayMode =
            suppModeTemp == 'b,g,n'
              ? ['b,g,n', ...split(suppModeTemp, ','), 'b,g', 'g,n']
              : [...split(suppModeTemp, ',')]
          this.arrayTransmit = split(
            res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1]
              .TransmitPowerSupported._value,
            ','
          )
        }
        tempData.map((item) => {
          if (item.ssidNumber <= 4) {
            this.tabDataA.push(item)
          } else {
            this.tabDataB.push(item)
          }
        })
        this.formEditable(res)
        if (this.bandwidth == '2.4') {
          if (this.form.modeValue.search('n') == -1) {
            this.arrayBandwidth = ['20MHz']
          } else {
            this.arrayBandwidth = ['20MHz', '40MHz', '20/40MHz']
          }
        }
        // push table
        this.dataTable[0].value = this.form.wifiNameValue
        this.dataTable[1].value = this.form.enableSSIDValue
        this.dataTable[2].value = this.form.wifiBroadcast
        this.dataTable[3].value = this.form.wifiIssolationValue
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async onTab(value) {
      this.tabPanelValue = value
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)
        const tempData = JSON.parse(res.data[0].VirtualParameters.WLANAll._value)
        const filter = this.filterData(tempData, this.tabPanelValue)
        this.dataTable = mapWlan(filter[0])

        this.formEditable(res)
        // push table
        this.dataTable[0].value = this.form.wifiNameValue
        this.dataTable[1].value = this.form.enableSSIDValue
        this.dataTable[2].value = this.form.wifiBroadcast
        this.dataTable[3].value = this.form.wifiIssolationValue
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async onBandwidth(value) {
      const res = await getDetailDeviceAcs(this.idParams)
      const tempData = JSON.parse(res.data[0].VirtualParameters.WLANAll._value)
      this.bandwidth = value

      if (this.bandwidth == '2.4') {
        this.tabPanelValue = '1'
        const tempSplitChnnl = split(
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1].PossibleChannels
            ._value,
          ';'
        )
        const suppModeTemp =
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1].SupportedStandards
            ._value

        this.arrayChannel = ['auto', ...split(tempSplitChnnl[0], ',')]
        this.arrayMode =
          suppModeTemp == 'b,g,n'
            ? ['b,g,n', ...split(suppModeTemp, ','), 'b,g', 'g,n']
            : [...split(suppModeTemp, ',')]
        this.arrayTransmit = split(
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[1].TransmitPowerSupported
            ._value,
          ','
        )
        if (this.form.modeValue.search('n') == -1) {
          this.arrayBandwidth = ['20MHz']
        } else {
          this.arrayBandwidth = ['20MHz', '40MHz', '20/40MHz']
        }
      } else if (this.bandwidth == '5') {
        this.arrayBandwidth = ['20MHz', '40MHz', '80MHz']
        this.tabPanelValue = '5'
        const tempSplitChnnl = split(
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[5].PossibleChannels
            ._value,
          ';'
        )
        const suppModeTemp =
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[5].SupportedStandards
            ._value

        this.arrayChannel = ['auto', ...split(tempSplitChnnl[0], ',')]
        this.arrayMode =
          suppModeTemp == 'a,n,ac'
            ? ['a,n,ac', ...split(suppModeTemp, ',')]
            : [...split(suppModeTemp, ',')]
        this.arrayTransmit = split(
          res.data[0].InternetGatewayDevice.LANDevice[1].WLANConfiguration[5].TransmitPowerSupported
            ._value,
          ','
        )
      }
      const filter = this.filterData(tempData, this.tabPanelValue)
      this.dataTable = mapWlan(filter[0])

      // editable valaue
      this.formEditable(res)
      // push table
      this.dataTable[0].value = this.form.wifiNameValue
      this.dataTable[1].value = this.form.enableSSIDValue
      this.dataTable[2].value = this.form.wifiBroadcast
      this.dataTable[3].value = this.form.wifiIssolationValue
    },

    // task genie acs
    async onSubmitWIfi() {
      this.isLoading = true
      const form = JSON.stringify({
        name: 'setParameterValues',
        parameterValues: [ParamsSSIDName(this.tabPanelValue, this.form.wifiNameValue)]
      })
      await taskGenie(this.idDevice, form)
        .then((res) => {
          if (res.status === 200) {
            this.tabDataA = []
            this.tabDataB = []
            this.getData()
            message.success('Task Success')
            this.isModal.openWifi = false
          } else {
            message.error('Task Failed')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    async onEnableWifi(value) {
      this.params.paramsEnable = ParamsEnableWifi(this.tabPanelValue, value)
    },
    async onSelectChannel(value) {
      this.form.channelValue = value
      let autoChnnl = false
      if (this.form.channelValue == 'auto') {
        autoChnnl = true
        this.params.paramsAutoChannel = ParamsAutoChannel(autoChnnl)
      } else {
        autoChnnl = false
        this.params.paramsAutoChannel = ParamsAutoChannel(autoChnnl)
        this.params.paramsChannel = ParamsChannel(this.form.channelValue)
      }
    },
    async onSelectMode(value) {
      this.form.modeValue = value
      if (this.bandwidth == '2.4') {
        if (this.form.modeValue.search('n') == -1) {
          this.arrayBandwidth = ['20MHz']
          this.form.bandwidthValue = 0
          this.params.paramsChannelWidth = ParamsChannelWidth(0)
          this.params.paramsStandart = ParamsStandard(value)
        } else {
          this.arrayBandwidth = ['20MHz', '40MHz', '20/40MHz']
          this.params.paramsChannelWidth = ParamsChannelWidth(0)
          this.params.paramsStandart = ParamsStandard(value)
        }
      } else if (this.bandwidth == '5') {
        this.arrayBandwidth = ['20MHz', '40MHz', '80MHz']
      }
    },
    async onSelectBandwidth(value) {
      this.form.bandwidthValue = value
      this.params.paramsChannelWidth = ParamsChannelWidth(value)
    },
    async onSelectTransmit(value) {
      this.form.transMitValue = value
      this.params.paramstrasnmitPower = ParamsTransmitPower(value)
    },
    async onSelectMaxUsr(value) {
      this.form.maxUserValue = value
      this.params.paramsMaxUsr = ParamsMaxUser(value)
    },
    onEnableSSID(value) {
      this.form.enableSSIDValue = value
      this.params.paramsEnableSSID = ParamsEnableSSID(this.tabPanelValue, this.form.enableSSIDValue)
    },
    onEnableWifiBroadcast(value) {
      this.form.wifiBroadcast = value
      this.params.paramsEnableWifibroadcast = ParamsAdsSSID(
        this.tabPanelValue,
        this.form.wifiBroadcast
      )
    },
    onEnableIssolation(value) {
      this.form.wifiIssolationValue = value
      this.params.paramsEnableWifiIssolation = ParamsWifiIssolation(
        this.tabPanelValue,
        this.form.wifiIssolationValue
      )
    },
    async onAuthWifi() {
      this.isModal.openWifiPass = true

      await this.getDetailAuthWifi()
    },
    onCancelAuth() {
      this.isModal.openWifiPass = false
      this.clearFormAuth()
    },
    async onSubmit() {
      this.isLoading = true
      const form = JSON.stringify({
        name: 'setParameterValues',
        parameterValues: [
          this.params.paramsEnable,
          this.params.paramsStandart,
          this.params.paramsChannelWidth,
          this.params.paramsChannel,
          this.params.paramsAutoChannel,
          this.params.paramstrasnmitPower,
          this.params.paramsMaxUsr,
          this.params.paramsEnableSSID,
          this.params.paramsEnableWifibroadcast,
          this.params.paramsEnableWifiIssolation
        ].filter((param) => param !== null && param !== undefined)
      })
      await taskGenie(this.idDevice, form)
        .then((res) => {
          if (res.status === 200) {
            this.tabDataA = []
            this.tabDataB = []
            this.getData()
            message.success('Task Success')
            this.params.paramsEnable = null
            this.params.paramsStandart = null
            this.params.paramsChannelWidth = null
            this.params.paramsBandwidth = null
            this.params.paramsChannel = null
            this.params.paramsAutoChannel = null
            this.params.paramstrasnmitPower = null
            this.params.paramsMaxUsr = null
            this.params.paramsEnableSSID = null
            this.params.paramsEnableWifibroadcast = null
            this.params.paramsEnableWifiIssolation = null
          } else {
            message.error('Task Failed')
          }
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onEncryptMode(value) {
      this.clearParamsAuth()
      this.form.encrytpModeValue = value
      if (value === 'WEPEncryption') {
        this.params.paramsEncryptMode = ParamsBasicEncrypt(this.tabPanelValue, value)
      } else {
        this.form.beaconTypeValue = '11i'
        this.arrayWpaEncryptMode = [{ name: 'AES', value: 'AESEncryption' }]
        this.form.wpaEncryptModeValue = this.arrayWpaEncryptMode[0].value

        this.params = {
          ...this.params,
          paramsBeaconType: ParamsBeaconType(this.tabPanelValue, this.form.beaconTypeValue),
          paramsWpaEncryptMode: ParamsWpaEncryptionModes(
            this.tabPanelValue,
            this.form.wpaEncryptModeValue
          )
        }
      }
    },
    onSelectBeaconType(value) {
      this.form.beaconTypeValue = value
      if (this.form.beaconTypeValue === 'WPAand11i') {
        this.arrayWpaEncryptMode = [{ name: 'TKIP/AES', value: 'TKIPandAESEncryption' }]
      } else {
        this.arrayWpaEncryptMode = [{ name: 'AES', value: 'AESEncryption' }]
      }

      this.form.wpaEncryptModeValue = this.arrayWpaEncryptMode[0].value
      this.params = {
        ...this.params,
        paramsBeaconType: ParamsBeaconType(this.tabPanelValue, this.form.beaconTypeValue),
        paramsWpaEncryptMode: ParamsWpaEncryptionModes(
          this.tabPanelValue,
          this.form.wpaEncryptModeValue
        )
      }
    },
    onWpaEncryptMode(value) {
      this.form.wpaEncryptModeValue = value
      this.params.paramsWpaEncryptMode = ParamsWpaEncryptionModes(
        this.tabPanelValue,
        this.form.wpaEncryptModeValue
      )
    },
    inputWpaKey(value) {
      this.form.wpaKeyValue = value
      this.params.paramsWpaKey = ParamsKeyPassphrase(this.tabPanelValue, this.form.wpaKeyValue)
    },
    onWepEncryptLevel(value) {
      this.form.wepEncryptLvValue = value
      this.params.paramsWepLv = ParamsWepEncryptLevel(
        this.tabPanelValue,
        this.form.wepEncryptLvValue
      )
    },
    onBasicAuthMode(value) {
      this.form.basicAuthModeValue = value
      this.params.paramsBasicAuthMode = ParamsBasicAuthMode(
        this.tabPanelValue,
        this.form.basicAuthModeValue
      )
      if (value == 'SharedAuthentication') {
        this.params.paramsBeaconType = ParamsBeaconType(this.tabPanelValue, 'Basic')
      } else {
        this.params.paramsBeaconType = null
      }
    },
    inputWepKey(value) {
      this.form.wepKeyValue = value
      this.params.paramsWepKey = ParamsWepKey(this.tabPanelValue, this.form.wepKeyValue)
    },
    async onSubmitAuth() {
      const form = JSON.stringify({
        name: 'setParameterValues',
        parameterValues: [
          this.params.paramsEncryptMode,
          this.params.paramsBeaconType,
          this.params.paramsWpaEncryptMode,
          this.params.paramsWpaKey,
          this.params.paramsBasicAuthMode,
          this.params.paramsWepLv,
          this.params.paramsWepKey
        ].filter((param) => param !== null && param !== undefined)
      })

      this.loadTask = true
      await taskGenie(this.idDevice, form)
        .then((res) => {
          if (res.status === 200) {
            message.success('Task Success')
            this.clearParamsAuth()
            this.clearFormAuth()
            this.isModal.openWifiPass = false
          } else {
            message.error('Task Failed')
          }
        })
        .catch((e) => {
          console.log(e)
          this.loadTask = true
        })
        .finally(() => {
          this.loadTask = false
        })
    }
  },

  mounted() {
    this.getData()
  },
  watch: {
    '$route.params.id': {
      immediate: false,
      handler() {
        this.tabDataA = []
        this.tabDataB = []
        this.getData()
      }
    }
  }
}
</script>
