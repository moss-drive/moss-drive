import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uuid,
      stsData: (s) => s.stsData,
    }),
  },
  data() {
    return {
      isCreated: false,
    };
  },
  methods: {
    async initBucket() {
      try {
        if (Date.now() > (this.stsData.expiredAt || 0) * 1e3) {
          const { data: stsData } = await this.$http.get("$bucket/user/sts/assume-role");
          this.$setStore({
            stsData,
          });
        }
        const { accessKey, secretKey, sessionToken } = this.stsData;
        this.$bucket.setClient({
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          sessionToken,
        });
        this.bucketName = `moss-bucket${this.$inDev ? "-dev" : "-prod"}-` + this.uid.slice(-10);
        this.$bucket.defBucket = this.bucketName;
        if (localStorage.moss_bucket != this.bucketName) {
          await this.checkBucket();
        }
        this.isCreated = true;
        this.getList();
      } catch (error) {
        console.log(error);
        this.onError(error);
      }
    },
    async checkBucket() {
      const list = await this.$bucket.listBuckets();
      if (!list.find((it) => it.Name == this.bucketName)) {
        await this.$bucket.createBucket(this.bucketName);
      }
      localStorage.moss_bucket = this.bucketName;
    },
  },
};
