<template>
  <div class="container">
    <div>
      <p>
        <img :src="`${baseUrl}/img/${page.thumbnail}`" />
      </p>
      <hr />
      <h1 class="title">
        {{ page.title }}
      </h1>
      <hr />
      <p>
        <img :src="`${baseUrl}/ogp/${page.slug}.png`" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, payload }) {
    if (payload) {
      return { page: payload };
    } else {
      return {
        page: await require(`~/static/assets/data/${params.slug}.json`),
      };
    }
  },
  data() {
    return {
      baseUrl: process.env.baseUrl,
    };
  },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.page.title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.baseUrl + '/' + this.page.slug + '/',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.baseUrl + '/ogp/' + this.page.slug + '.png',
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'refresh',
          'http-equiv': 'refresh',
          content: '0;https://lbol-logs.github.io/1.5.1/2024-10-21T16-36-15Z_Cirno_B_DatiangouMaifan_L7_TrueEnd/'
        },
      ],
    };
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
