# msal


* `clone`
* `npm i`
* `npm run build`
* copy `msal.js`

```html
<script type="module">
    import { getAzureAuth, getAccessToken } from "./msaltest.js";

    window.getAccessToken = getAccessToken;
    window.getAzureAuth = getAzureAuth;
  
 </script>

```

you need to serve `/azure_config.json`

```json
{
    "AZURE_CLIENT_ID": "571adsdf40a6-9bs3c-48f1sdd-9fd2-1471b761f2dddf84",
    "AZURE_TENDANT_ID": "306bsdb27f-a2s30-403db-a43d6-2esd5cd45b8ec0",
    "AZURE_SCOPES": ["api://571adsdf40a6-9bs3c-48f1sdd-9fd2-1471b761f2dddf84/api", "User.Read"]
}
```