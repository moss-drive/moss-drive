<template>
  <div class="task-control">
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Account settings"
      caption="John Doe"
    >
      <template v-slot:header>
        <div class="task-header">
          <span class="fw-b fz-16">Uploading</span>
          <span class="fz-14 ml-1 file-count">({{ successTasks.length }}/{{ tasks.length }})</span>
        </div>
      </template>
      <!-- <div class="task-body">
        <div v-for="item in tasks" :key="item">
          <div class="al-c space-btw">
            <div class="py-4 px-2 al-c">
              <img src="" width="40" height="40" alt="" />
              <div class="ml-2">
                <div class="task-name fz-14">{{ item.param.Key }}</div>
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
      </div> -->

      <q-virtual-scroll style="max-height: 300px" :items="tasks" separator v-slot="{ item, index }">
        <div class="task-body">
          <div :key="item">
            <div class="al-c space-btw">
              <div class="py-4 px-2 al-c">
                <!-- <img src="" width="40" height="40" alt="" /> -->
                <div class="ml-2">
                  <div class="task-name fz-14">{{ item.param.Key }}</div>
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
    };
  },

  created() {
    this.$bus.on("uploadEvent", (val) => {
      console.log(val);
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
  },
  methods: {
    handleUpload(files) {
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
      const tasks = files.map((it) => {
        return new UploadTask(s3, {
          Bucket: "moss-bucket-prod-cc67371e16",
          Key: it.name,
          Body: it.file,
          ContentType: it.file.type,
        });
      });
      tasks.forEach((it) => {
        this.taskWrap.pushTasks(it);
      });

      this.tasks = this.tasks.concat(tasks);
      this.taskWrap.progressTask();
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
    .task-name {
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
