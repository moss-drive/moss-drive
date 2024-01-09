<template>
  <div class="w100p px-6" :class="isFixed ? 'pos-btm pos-f' : ''">
    <div class="al-c home-btm-content space-btw flex-wrap">
      <div class="al-c">
        <q-btn
          padding="xs"
          color="dark"
          class="mr-6 hover-1"
          target="_blank"
          :href="it.url"
          v-for="it in socials"
          :key="it.icon"
        >
          <img :src="`/img/home/icon_${it.icon}.svg`" height="20" />
        </q-btn>
      </div>
      <div>
        <span
          >Moss is built on <a href="https://www.4everland.org/" target="_blank">4EVERLAND</a></span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFixed: {
      type: Boolean,
      default: true,
    },
  },
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

<style lang="scss" scoped>
.home-btm-content {
  height: 48px;
}
</style>
