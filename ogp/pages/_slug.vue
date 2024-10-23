<template>
  <div class="container">
    Redirecting...
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, payload }) {
    return { payload };
  },
  data() {
    return {
      // baseUrl: process.env.baseUrl
    };
  },
  head() {
    const { title, description, url, ogp } = this.payload;
    return {
      title,
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex'
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: url,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: ogp,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        // {
        //   hid: 'refresh',
        //   'http-equiv': 'refresh',
        //   content: `0;${url}`
        // },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: url
        }
      ]
    };
  },
};
</script>