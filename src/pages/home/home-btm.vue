<template>
  <div class="pos-btm pos-f w100p pa-3 mb-3">
    <div class="main-wrap al-c">
      <div class="al-c">
        <a class="mr-6 hover-1" target="_blank" :href="it.url" v-for="it in socials" :key="it.icon">
          <img :src="`/img/home/icon_${it.icon}.svg`" height="22" />
        </a>
      </div>
      <div class="ml-auto">
        <a :href="it.url" class="ml-5 hover-1" target="_blank" v-for="(it, i) in links" :key="i">{{
          it.label
        }}</a>
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
      ],
      links: [
        {
          label: "White Paper",
          url: "http://docs.mymoss.io/",
        },
        {
          label: "Email",
          url: "mailto:hello@mymoss.io",
        },
      ],
    };
  },
};
</script>