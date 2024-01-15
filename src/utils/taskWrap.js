import { Upload } from "@4everland/s3-lib-storage";
import { getFileSize } from "../utils/helper";

export class UploadTask {
  static id = 0;
  s3;
  task;
  constructor(s3, param) {
    this.s3 = s3;
    this.id = UploadTask.id++;
    this.status = 0; //waitingUpload
    this.param = param;
    this.loaded = 0;
    this.totalSize = 0;
    this.progress = 0;
    this.invalidAccessKey = false;
  }
  async start() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
        maxAttempts: 10,
      });
      this.totalSize = getFileSize(this.task.totalBytes);
      this.task.on("httpUploadProgress", (e) => {
        this.progress = (e.loaded / e.total) * 100;
        this.loaded = getFileSize(e.loaded);
      });
      this.progress = 0;
      this.status = 1; // uploading
      await this.task.done();
      this.status = 3; // success
      //---------------------
    } catch (e) {
      console.log(e.Code);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        if (e.Code == "InvalidAccessKeyId") {
          this.invalidAccessKey = true;
        }
        throw new Error(e.Code);
      }
    }
  }
  async cancel() {
    if (this.task) {
      await this.task.abort();
    }
    console.log("abort");
    this.status = 2; //cancel/stop
  }
  // s3 accessKey expired or invalid
  updateS3Instance(s3) {
    this.s3 = s3;
  }
  resetStatus() {
    this.status = 0;
  }
}

export class TaskWrapper {
  tasks = [];
  limit;
  constructor(limit) {
    this.limit = limit;
  }
  pushTasks(task) {
    this.tasks.push(task);
  }
  async progressTask() {
    const tasks = this.tasks.filter((task) => {
      return task.status == 1;
    });
    if (tasks.length >= this.limit) return;
    const preTasks = this.tasks.filter((task) => {
      return task.status == 0;
    });
    if (!preTasks) return;
    const fill = this.limit - tasks.length;
    const finalCount = preTasks.length <= fill ? preTasks.length : fill;

    for (let i = 0; i < finalCount; i++) {
      this.startTask(preTasks[i]);
    }
  }
  async startTask(task) {
    await task.start();
    this.progressTask();
  }
}
