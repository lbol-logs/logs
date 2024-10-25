<template>
  <div class="container">
    Redirecting to the <a id="link" :href="payload.url">log</a>...
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
    const { version, id, title, description, url, ogp } = this.payload;

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
          hid: 'og:site_name',
          property: 'og:site_name',
          content: this.siteName,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: url
        }
      ],
      script: [
        {
          src: '/redirect.js'
        }
      ]
    };
  },
  // created() {
  //   console.log(window.location.href)
  // }
};
</script>

<!-- <script setup>
const { payload: { url }, query } = this;
const qs = Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
const href = url + (qs ? ('?' + qs) : '');
console.log({href})
if (process.browser) {
  window.location.href = href;
  link.href = href;
}
</script> -->