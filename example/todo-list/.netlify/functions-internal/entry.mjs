import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { s as server_default, h as deserializeManifest } from './chunks/astro.c3a57b74.mjs';
import { _ as _page0, a as _page1, b as _page2, c as _page3, d as _page4, e as _page5, f as _page6, g as _page7, h as _page8, i as _page9 } from './chunks/pages/all.c4d0c051.mjs';
import 'mime';
import 'cookie';
import 'html-escaper';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'string-width';
/* empty css                                 */import 'fs/promises';

const pageMap = new Map([["src/pages/index.astro", _page0],["src/pages/api-client/create-todo-client.ts", _page1],["src/pages/api-client/remove-todo-client.ts", _page2],["src/pages/api-client/update-todo-client.ts", _page3],["src/pages/api-client/get-todos-client.ts", _page4],["src/pages/api-client/README.md", _page5],["src/pages/api/create-todo.ts", _page6],["src/pages/api/remove-todo.ts", _page7],["src/pages/api/update-todo.ts", _page8],["src/pages/api/get-todos.ts", _page9],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["_astro/index.04b2167a.css"],"scripts":[{"type":"inline","value":"const r=async(a,e={})=>{let t=\"http://localhost:3002/api/create-todo\";return e&&e.query&&(t+=\"?\"+Object.keys(e.query).map(o=>o+\"=\"+e.query[o]).join(\"&\")),delete e.query,e.method=\"POST\",e.body=JSON.stringify(a),(await fetch(t,e)).json()},u=async(a,e={})=>{let t=\"http://localhost:3002/api/remove-todo\";return e&&e.query&&(t+=\"?\"+Object.keys(e.query).map(o=>o+\"=\"+e.query[o]).join(\"&\")),delete e.query,e.method=\"DELETE\",e.body=JSON.stringify(a),(await fetch(t,e)).json()},n=async(a,e={})=>{let t=\"http://localhost:3002/api/update-todo\";return e&&e.query&&(t+=\"?\"+Object.keys(e.query).map(o=>o+\"=\"+e.query[o]).join(\"&\")),delete e.query,e.method=\"PATCH\",e.body=JSON.stringify(a),(await fetch(t,e)).json()},l=document.querySelector(\"#add-todo-button\"),c=document.querySelector(\"#add-todo-input\"),d=async()=>{await r({isDone:!1,task:c.value}),document.location.reload()};l.onclick=()=>{d()};c.onkeyup=a=>{a.key===\"Enter\"&&d()};c.focus();const y=document.querySelectorAll(\"input[name=todo-is-done]\");y.forEach(a=>a.onclick=async e=>{const t=e.target,o=JSON.parse(t.getAttribute(\"data-todo\"));o.isDone=t.checked,await n(o),document.location.reload()});const s=document.querySelectorAll(\"button[name=todo-delete]\");s.forEach(a=>a.onclick=async e=>{const t=e.target,o=JSON.parse(t.getAttribute(\"data-todo\"));await u({id:o.id}),document.location.reload()});\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api-client/create-todo-client","type":"endpoint","pattern":"^\\/api-client\\/create-todo-client$","segments":[[{"content":"api-client","dynamic":false,"spread":false}],[{"content":"create-todo-client","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api-client/create-todo-client.ts","pathname":"/api-client/create-todo-client","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api-client/remove-todo-client","type":"endpoint","pattern":"^\\/api-client\\/remove-todo-client$","segments":[[{"content":"api-client","dynamic":false,"spread":false}],[{"content":"remove-todo-client","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api-client/remove-todo-client.ts","pathname":"/api-client/remove-todo-client","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api-client/update-todo-client","type":"endpoint","pattern":"^\\/api-client\\/update-todo-client$","segments":[[{"content":"api-client","dynamic":false,"spread":false}],[{"content":"update-todo-client","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api-client/update-todo-client.ts","pathname":"/api-client/update-todo-client","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api-client/get-todos-client","type":"endpoint","pattern":"^\\/api-client\\/get-todos-client$","segments":[[{"content":"api-client","dynamic":false,"spread":false}],[{"content":"get-todos-client","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api-client/get-todos-client.ts","pathname":"/api-client/get-todos-client","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api-client/readme","type":"page","pattern":"^\\/api-client\\/README\\/?$","segments":[[{"content":"api-client","dynamic":false,"spread":false}],[{"content":"README","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api-client/README.md","pathname":"/api-client/README","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/create-todo","type":"endpoint","pattern":"^\\/api\\/create-todo$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"create-todo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/create-todo.ts","pathname":"/api/create-todo","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/remove-todo","type":"endpoint","pattern":"^\\/api\\/remove-todo$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"remove-todo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/remove-todo.ts","pathname":"/api/remove-todo","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/update-todo","type":"endpoint","pattern":"^\\/api\\/update-todo$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"update-todo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/update-todo.ts","pathname":"/api/update-todo","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/get-todos","type":"endpoint","pattern":"^\\/api\\/get-todos$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"get-todos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/get-todos.ts","pathname":"/api/get-todos","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true,"contentDir":"file:///Users/admin/Code/astro-client-generator/example/todo-list/src/content/"},"pageMap":null,"propagation":[["/Users/admin/Code/astro-client-generator/example/todo-list/src/layouts/Layout.astro","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/get-todos-client.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/index.astro","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/create-todo-client.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/remove-todo-client.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/update-todo-client.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/README.md","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api/create-todo.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api/remove-todo.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api/update-todo.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api/get-todos.ts","in-tree"],["/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/index.astro?astro&type=style&index=0&lang.css","in-tree"]],"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.fa4d2d68.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/index.04b2167a.css","/favicon.svg"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
