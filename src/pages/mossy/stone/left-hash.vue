<template>
  <div class="al-c f-wrap">
    <div class="mr-2">
      Stone ID <b class="color-1">#{{ info.stoneId }}</b>
    </div>
    <div class="mr-2 al-c">
      <span class="mr-1">Network</span>
      <net-icon :chainId="info.chainId" :size="18" />
    </div>
    <div class="mr-2" v-if="txLink">
      <q-btn :href="txLink" target="_blank" color="info" rounded unelevated size="xs" dense>
        <div class="al-c px-2">
          <img src="/img/mossy/icon/ic-trans.svg" width="16" />
          <span class="color-1 ml-1 fz-12">Key TXs</span>
        </div>
      </q-btn>
    </div>
    <div>
      <q-btn color="info" rounded unelevated size="xs" dense>
        <div class="al-c px-2">
          <img src="/img/mossy/icon/ic-ver.svg" width="16" />
          <span class="color-1 ml-1 fz-12">Version History</span>
        </div>
        <q-menu style="width: 350px">
          <q-card class="bg-card-1">
            <q-card-section>
              <div class="fw-b fz-14">Version History</div>
              <q-markup-table class="no-border" flat square :bordered="false">
                <thead>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Action</th>
                    <th class="text-left">AR Hash</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in info.arHashList" :key="item.updatedAt">
                    <tr>
                      <td class="text-left">
                        {{ new Date(item.updatedAt * 1000).format("date") }}
                      </td>
                      <td>
                        {{ item.action == 0 ? "Create" : "Update" }}
                      </td>
                      <td>
                        <a :href="getArLink(item.arHash)" target="_blank" class="color-a hover-1">
                          <u>{{ item.arHash.cutStr(4, 4) }}</u>
                        </a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script>
const { VITE_OP_CHAINID, VITE_BLAST_CHAINID } = import.meta.env;

export default {
  props: {
    info: Object,
  },
  data() {
    return {};
  },
  computed: {
    txLink() {
      let pre = "";
      const { chainId, stoneId } = this.info;
      if (chainId == VITE_OP_CHAINID * 1) {
        pre = "https://opensea.io/assets/optimism/0x8a6569e85c97a1bbe2d4ea539a0c9c873c5f55fe/";
      } else if (chainId == VITE_BLAST_CHAINID * 1) {
        pre = "https://opensea.io/assets/blast/0x824812adfa718c272626660d96184df907aacf8a/";
      }
      if (pre) return pre + stoneId;
    },
  },
  methods: {
    getArLink(hash) {
      return "https://viewblock.io/arweave/tx/" + hash;
      // hash = hash.replace(/^-*/, "")
      // return `https://${hash}.arweave.net`;
    },
  },
};
</script>