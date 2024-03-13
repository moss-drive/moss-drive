<template>
  <div>
    <net-choose :is-connect="isConnect" v-if="fromTop" @click="onChoose" @item="onItem" />
    <q-btn rounded color="primary" @click="getAccount" v-else-if="!isConnect">
      Connect Wallet
    </q-btn>
    <q-btn-dropdown color="primary" v-else-if="!isChoosed">
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
    <slot v-else :chainId="chainId"></slot>
    <!-- <div>{{ isChoosed }}</div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { switchNet, netList } from "../../utils/wallet";

export default {
  props: {
    fromTop: Boolean,
    needSame: {
      type: Boolean,
      // default: true, // invalid login addr eq wallet addr
    },
    noInvited: {
      type: Boolean,
      default: false,
    },
    fixId: Number,
    forId: Number,
  },
  data() {
    return {
      accounts: [],
      chainId: null,
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
    }),
    account() {
      return this.accounts[0];
    },
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
      if (this.fromTop) return true;
      return this.account?.toLowerCase() == this.uid?.toLowerCase();
    },
    isConnect() {
      if (this.needSame) return this.addrMatch;
      return this.accounts.length > 0;
    },
  },
  watch: {
    forId(val) {
      console.log("forid", val);
      if (val && this.isConnect) {
        this.switchNet(val);
      }
    },
  },
  created() {
    if (window.ethereum && this.uid) {
      this.chainId = window.ethereum.chainId;
      this.initWallet();
      this.getAccount();
    }
  },
  methods: {
    switchNet,
    onChoose() {
      if (!this.isConnect) {
        this.getAccount();
      }
    },
    onItem(it) {
      this.switchNet(it.id);
    },
    async getAccount() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        this.accounts = accounts;
        if (this.needSame && !this.addrMatch) {
          console.log(this.account, "not same", this.uid);
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
      this.setChainId();
      window.ethereum.on("accountsChanged", (accounts) => {
        this.accounts = accounts;
        this.onChange({
          accounts,
        });
      });
      window.ethereum.on("chainChanged", (chainId) => {
        console.log(chainId);
        this.chainId = chainId * 1;
        this.onChange({
          chainId,
        });
        this.setChainId();
      });
    },
    setChainId() {
      this.$setState({
        myChainId: this.chainId * 1,
      });
    },
    genChainId(id) {
      return "0x" + Number(id).toString(16);
    },
  },
};
</script>
