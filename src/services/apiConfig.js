export const PROD_URL_REMOTE = `https://library.wooks.lk`; // -->please change bookSave ui
export const DEV_URL_REMOTE = `https://wportal.ceyentra.lk`;

export const asDev = false;

const conf = {
  serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
  basePath: !asDev ? `wooks/api/v1` : `storybooks/api/v1`,
  redirect: ``
};

export default conf;
