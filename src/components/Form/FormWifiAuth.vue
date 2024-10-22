<template>
  <main>
    <a-modal :open="isOpen" @cancel="onCancel" title="Setting WiFi Auth" :footer="false">
      <SpinLoading :loading="isLoading" />
      <section>
        <a-form layout="vertical">
          <!-- open -->
          <section>
            <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="Encryption Mode">
              <a-select :value="encryptMode" @change="onEncryptMode" :hidden="bandwidth == '5'">
                <a-select-option v-for="item in arrayEncryptMode" :key="item" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-select :value="encryptMode" @change="onEncryptMode" :hidden="bandwidth == '2.4'">
                <a-select-option
                  v-for="item in arrayEncryptMode5Ghz"
                  :key="item"
                  :value="item.value"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </section>

          <!-- wpa -->
          <section v-if="beaconTypeValue?.search('11i') != 1">
            <section v-if="encryptMode === 'WPA/WPA2'">
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WPA Version">
                <a-select :value="beaconTypeValue" @change="onSelectBeaconType">
                  <a-select-option v-for="item in arrayBeaconType" :key="item" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WPA Encryption Mode">
                <a-select :value="wpaEncryptMode" @change="onWpaEncryptMode">
                  <a-select-option
                    v-for="item in arrayWpaEncryptMode"
                    :key="item"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WPA Key">
                <a-input-password
                  :status="validate.wpaKeyValidate != null ? 'error' : ''"
                  :value="wpaKey"
                  @change="inputWpaKey($event.target.value)"
                />
                <small
                  :class="validate.wpaKeyValidate ? 'text-red-600' : ''"
                  v-if="validate.wpaKeyValidate"
                >
                  {{ validate.wpaKeyValidate }}
                </small>
              </a-form-item>
            </section>

            <!-- wep -->
            <section v-if="encryptMode == 'WEPEncryption'">
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WEP Encryption Mode">
                <a-select :value="basicAuthMode" @change="onBasicAuthMode">
                  <a-select-option
                    v-for="item in arrayWepEncryptMode"
                    :key="item"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WPE Encryption Level">
                <a-radio-group :value="wepEncryptionLevel" @change="onWepEncryptLevel">
                  <a-radio v-for="item in arrayWepEncryptLevel" :key="item" :value="item.value">
                    {{ item?.name }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="mb-0 mt-2" name="EncryptionMode" label="WEP Key">
                <a-input-password :value="wepKey" @change="inputWepKey($event.target.value)" />
                <small
                  :class="validate.wepKeyValidate ? 'text-red-600' : ''"
                  v-if="validate.wepKeyValidate"
                >
                  {{ validate.wepKeyValidate }}
                </small>
              </a-form-item>
            </section>
          </section>

          <a-form-item class="mb-0 mt-2 flex flex-row justify-end">
            <a-button size="small" type="primary" @click="onSubmit" :loading="isLoading">
              Submit
            </a-button>
          </a-form-item>
        </a-form>
      </section>
    </a-modal>
  </main>
</template>
<script>
import SpinLoading from '../Spin/SpinLoading.vue'
export default {
  components: { SpinLoading },
  props: {
    isLoading: Boolean,
    isOpen: Boolean,
    bandwidth: String,
    encryptMode: String,
    beaconTypeValue: String,
    wpaEncryptMode: String,
    wpaKey: String,
    wpeEncryptMode: String,
    wpeEncryptLv: String,
    wpeKey: String,
    wpsEnble: String,
    wepEncryptionLevel: String,
    basicAuthMode: String,
    arrayWpaEncryptMode: Array,
    wepKey: String
  },
  data: () => ({
    validate: {
      wpaKeyValidate: null,
      wepKeyValidate: null
    },
    arrayEncryptMode: [
      { name: 'WEP', value: 'WEPEncryption' },
      { name: 'WPA/WPA2 Personal ', value: 'WPA/WPA2' }
    ],
    arrayEncryptMode5Ghz: [{ name: 'WPA/WPA2 Personal ', value: 'WPA/WPA2' }],
    arrayBeaconType: [
      { name: 'WPA2', value: '11i' },
      { name: 'WPA/WPA2', value: 'WPAand11i' }
    ],
    arrayWepEncryptMode: [
      { name: 'Open System', value: 'None' },
      { name: 'Share Key', value: 'SharedAuthentication' }
    ],
    arrayWepEncryptLevel: [
      { name: '128 bit', value: '104-bit' },
      { name: '64 bit', value: '40-bit' }
    ]
  }),
  methods: {
    onCancel() {
      this.validate.wpaKeyValidate = null
      this.$emit('onCancel')
    },
    onSubmit() {
      this.$emit('onSubmit')
    },
    onEncryptMode(value) {
      this.$emit('onEncryptMode', value)
    },
    onSelectBeaconType(value) {
      this.$emit('onSelectBeaconType', value)
    },
    onWpaEncryptMode(value) {
      this.$emit('onWpaEncryptMode', value)
    },
    inputWpaKey(value) {
      const regex = /^(?=[A-Za-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

      const commonWords = ['password', '123456', 'qwerty']
      const containsSimpleWord = commonWords.some((word) => value.toLowerCase().includes(word))

      if (containsSimpleWord) {
        this.validate.wpaKeyValidate =
          'New password shouldn’t contain simple words, please input again!'
      } else if (!regex.test(value)) {
        this.validate.wpaKeyValidate =
          'Password must be at least 8 characters, contain one uppercase, one lowercase, one number, and one special character. First character cannot be special.'
      } else {
        this.validate.wpaKeyValidate = null
      }

      this.$emit('inputWpaKey', value)
    },
    onBasicAuthMode(value) {
      this.$emit('onBasicAuthMode', value)
    },
    onWepEncryptLevel(event) {
      this.$emit('onWepEncryptLevel', event.target.value)
    },
    inputWepKey(value) {
      if (this.wepEncryptionLevel == '40-bit') {
        if (value.length < 5) this.validate.wepKeyValidate = 'WEP Key must be 5 characters'
        else this.validate.wepKeyValidate = ''
      } else if (this.wepEncryptionLevel == '104-bit') {
        if (value.length < 13) this.validate.wepKeyValidate = 'WEP Key must be 13 characters'
        else this.validate.wepKeyValidate = ''
      } else {
        this.validate.wepKeyValidate = ''
      }
      this.$emit('inputWepKey', value)
    }
  }
}
</script>
0 : null 1 : "WPA/WPA2" 2 : "11i" 3 : "AESEncryption" 4 : "Adas@12d" 5 : null length : 6
