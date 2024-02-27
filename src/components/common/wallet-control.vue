<template>
  <div>
    <q-btn-dropdown color="primary" v-if="fromTop || (isConnect && !isChoosed)">
      <template v-slot:label>
        <net-icon :chainId="chainId" v-if="fromTop"></net-icon>
        <div class="al-c" v-else>
          <q-icon left name="error_outline" />
          <span class="ml-2">Switch Network</span>
        </div>
      </template>

      <q-list>
        <q-item
          clickable
          v-close-popup
          @click="switchNet(it.id)"
          v-for="it in netList"
          :key="it.name"
        >
          <div class="al-c">
            <q-avatar size="22px">
              <img :src="`/img/common/${it.icon}`" />
            </q-avatar>
            <span class="ml-2">{{ it.name }}</span>
          </div>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn rounded color="primary" @click="getAccount" v-else-if="!isConnect">
      Connect Wallet
    </q-btn>
    <slot v-else></slot>
    <!-- <div>{{ isChoosed }}</div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { switchNet, netList } from "../../utils/wallet";

export default {
  props: {
    fromTop: Boolean,
    sameAddr: {
      type: Boolean,
      default: true, // invalid login addr eq wallet addr
    },
    noInvited: {
      type: Boolean,
      default: false,
    },
    fixId: Number,
  },
  data() {
    return {
      accounts: [],
      chainId: window.ethereum.chainId,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    chain_id() {
      return Number(this.chainId);
    },
    isChoosed() {
      return !!this.netList.find((it) => it.id == this.chain_id);
    },
    netList() {
      return netList.filter((it) => {
        if (!this.fixId) return true;
        return it.id == this.fixId;
      });
    },
    addrMatch() {
      if (!this.accounts.length) return false;
      return this.accounts[0]?.toLowerCase() == this.uid?.toLowerCase();
    },
    isConnect() {
      if (this.sameAddr) return this.addrMatch;
      return this.accounts.length > 0;
    },
  },
  created() {
    this.initWallet();
    this.getAccount();
  },
  methods: {
    switchNet,
    async getAccount() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        this.accounts = accounts;
        if (this.sameAddr && !this.addrMatch) {
          throw new Error(
            `Please use the wallet address associated with the current account for signing. The current account is ${this.uid?.cutStr(
              4,
              6
            )}`
          );
        }
      } catch (error) {
        console.log(error);
        if (this.noInvited) {
          return;
        }
        let msg = error.message;
        this.$alert(msg);
      }
    },
    onChange(obj) {
      this.$emit("change", obj);
    },
    initWallet() {
      window.ethereum.on("accountsChanged", (accounts) => {
        this.accounts = accounts;
        this.onChange({
          accounts,
        });
      });
      window.ethereum.on("chainChanged", (chainId) => {
        console.log(chainId);
        this.chainId = chainId;
        this.onChange({
          chainId,
        });
      });
    },
    genChainId(id) {
      return "0x" + Number(id).toString(16);
    },
  },
};
</script>

<style lang="scss" scoped></style>
