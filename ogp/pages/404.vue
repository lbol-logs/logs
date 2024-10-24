<template>
  <div class="container">
    Redirecting to <a :href="payload.githubUrl">LBoL Logs</a>...
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, payload }) {
    return { payload };
  },
  data() {
    return {
      siteName: process.env.siteName
    };
  },
  head() {
    const { githubUrl } = this.payload;

    return {
      title: this.siteName,
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex'
        },
        {
          hid: 'refresh',
          'http-equiv': 'refresh',
          content: `0;${githubUrl}`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: githubUrl
        }
      ]
    };
  },
};
</script>