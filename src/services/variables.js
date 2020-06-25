const header = process.env.VUE_APP_HEADER;
const data = process.env.VUE_APP_SERVICIO_DATA;
const auth = process.env.VUE_APP_SERVICIO_AUTH;
const image = process.env.VUE_APP_SERVICIO_IMAGES;
const test = process.env.VUE_APP_DATABASE_TEST;
const http = process.env.VUE_APP_REQUEST;
const upload = process.env.VUE_APP_SERVICIO_POST_IMAGES;
const tenantId = process.env.VUE_APP_TENANT_ID;

export default {header, data, auth, image, test, http, upload, tenantId};