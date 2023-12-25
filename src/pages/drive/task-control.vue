<template>
  <div class="task-control" v-show="showRoute && showControl">
    <q-expansion-item expand-separator v-model="expanded">
      <template v-slot:header>
        <div class="task-header al-c space-btw">
          <div>
            <span class="fw-b fz-16">Uploading</span>
            <span class="fz-14 ml-1 file-count"
              >({{ successTasks.length }}/{{ tasks.length }})</span
            >
          </div>
          <img @click.stop="showControl = false" width="24" src="/img/driver/close.svg" alt="" />
        </div>
      </template>
      <q-virtual-scroll style="max-height: 300px" :items="tasks" separator v-slot="{ item }">
        <div class="task-body">
          <div :key="item">
            <div class="al-c space-btw">
              <div class="py-4 px-2 al-c task-info">
                <!-- <img src="" class="mr-2" width="40" height="40" alt="" /> -->
                <div style="width: 100%">
                  <div class="task-name fz-14">{{ item.param.Key.replace("/", "") }}</div>
                  <div class="mt-2 fz-12">
                    <span class="task-load"> {{ item.loaded }}/{{ item.totalSize }}</span>
                    <span class="ml-2 task-status">{{ status(item.status) }}</span>
                  </div>
                </div>
              </div>
              <div class="operation"></div>
            </div>
            <div class="progress">
              <div class="upload-progress" :style="{ width: item.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </q-virtual-scroll>
    </q-expansion-item>
  </div>
</template>

<script>
import { S3 } from "@aws-sdk/client-s3";
import { UploadTask, TaskWrapper } from "../../utils/taskWrap";
const { VITE_BUCKET_ENDPOINT, VITE_BUCKET_DOMAIN } = import.meta.env;
import { mapState } from "vuex";
export default {
  data() {
    return {
      tasks: [],
      taskWrap: new TaskWrapper(10),
      expanded: false,
      showControl: false,
    };
  },

  created() {
    this.$bus.on("uploadEvent", (val) => {
      this.handleUpload(val);
    });
  },
  computed: {
    ...mapState({
      stsData: (s) => s.stsData,
    }),
    status() {
      return function (status) {
        switch (status) {
          case 0:
            return "Pre Uploading";
          case 1:
            return "Uploading";
          case 2:
            return "Abort";
          case 3:
            return "Success";
          default:
            return "Faild";
        }
      };
    },
    successTasks() {
      return this.tasks.filter((it) => it.status == 3);
    },
    compelete() {
      const tasks = this.tasks.filter((it) => it.status == 1 || it.status == 0);
      return tasks.length == 0;
    },
    showRoute() {
      const path = this.$route.path;
      return (
        path.indexOf("/drive") != -1 ||
        path.indexOf("/stone") != -1 ||
        path.indexOf("/collection") != -1 ||
        path.indexOf("/txs") != -1
      );
    },
  },
  methods: {
    async handleUpload(files) {
      try {
        const totalSize = files.reduce((pre, it) => pre + it.file.size, 0);
        const ipfsStorageByte = await this.getStorage();
        console.log(ipfsStorageByte);
        console.log(totalSize > ipfsStorageByte * 1);
        if (totalSize > ipfsStorageByte * 1) {
          throw Error("Insufficient storage space is available to upload the file.");
        }
        const { accessKey, secretKey, sessionToken } = this.stsData;
        const s3 = new S3({
          endpoint: VITE_BUCKET_ENDPOINT,
          region: "eu-west-2",
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            sessionToken,
          },
        });
        const prifix = this.getPrefix();
        const tasks = files.map((it) => {
          return new UploadTask(s3, {
            Bucket: this.$bucket.defBucket,
            Key: prifix + "/" + it.name,
            Body: it.file,
            ContentType: it.file.type,
          });
        });
        tasks.forEach((it) => {
          this.taskWrap.pushTasks(it);
        });
        this.tasks = tasks.concat(this.tasks);
        this.showControl = true;
        this.expanded = true;
        this.taskWrap.progressTask();
      } catch (error) {
        this.$alert(error.message);
      }
    },

    getPrefix() {
      const pathArr = this.$route.path.split("/");
      pathArr.splice(1, 1);
      const Prefix = pathArr.join("/");
      return Prefix;
    },
    async getStorage() {
      const { data } = await this.$http.get("$pay/combo/usage/IPFS_STORAGE");
      return data;
    },
  },
  watch: {
    compelete(val) {
      if (val) {
        this.$bus.emit("drive-refresh");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .q-expansion-item__container {
  background: #0f172a;
  border-radius: 16px;
  .q-item {
    padding: 0;
  }
}
.task-control {
  position: fixed;
  width: 400px;
  right: 0;
  bottom: 40px;
  .task-header {
    padding: 24px;
    width: 400px;
    background: #0f172a;
    border-radius: 16px;
    .file-count {
      color: #cbd5e1;
    }
  }
  .task-body {
    background: #0f172a;
    .task-info {
      width: 70%;
    }
    .task-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .task-load {
      color: #94a3b8;
    }
    .task-status {
      color: #94a3b8;
    }

    .progress {
      height: 1px;
      background: #334155;
      .upload-progress {
        height: 1px;
        background: #1eefa4;
        transition: all 1s ease;
      }
    }
  }
}
</style>
