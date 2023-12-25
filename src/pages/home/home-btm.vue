<template>
  <div class="pos-btm pos-f w100p pa-6">
    <div class="al-c">
      <div class="al-c">
        <a class="mr-6 hover-1" target="_blank" :href="it.url" v-for="it in socials" :key="it.icon">
          <img :src="`/img/home/icon_${it.icon}.svg`" height="22" />
        </a>
      </div>
      <div class="ml-auto">
        <span
          >Moss is built on <a href="https://www.4everland.org/" target="_blank">4EVERLAND</a></span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socials: [
        {
          icon: "x",
          url: "https://twitter.com/mymoss_io",
        },
        {
          icon: "discord",
          url: "https://discord.com/invite/4everland",
        },
        {
          icon: "tg",
          url: "https://t.me/org_4everland",
        },
        {
          icon: "mail",
          url: "mailto:hello@mymoss.io",
        },
        {
          icon: "doc",
          url: "http://docs.mymoss.io/",
        },
      ],
    };
  },
};
</script>