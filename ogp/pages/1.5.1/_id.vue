<template>
  <div class="container">
    Redirecting...
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, payload }) {
  // TODO
  // console.log({params, error, payload});
    return { payload };
  },
  data() {
    return {
      baseUrl: process.env.baseUrl
    };
  },
  head() {
    // const { title, description, route } = this.payload;

    const title = 'Title';
      const description = 'Description';
      const version = '1.5.1';
      const id = '2024-10-23T09-58-19Z_Sanae_Kochiya_B_SanaeExhibitU_L7_TrueEnd';
      const route = `/${version}/${id}/`;

    const url = 'https://lbol-logs.github.io' + route;
    const ogp = `${this.baseUrl}/ogp${route.slice(0, -1)}.png`;

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