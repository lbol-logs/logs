const url = document.querySelector('link[rel="canonical"]').href;
const qs = window.location.search;
const href = url + qs
window.location.href = href;