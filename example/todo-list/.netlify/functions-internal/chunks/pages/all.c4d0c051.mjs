import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, e as renderSlot, f as renderComponent, m as maybeRenderHead, g as createVNode, F as Fragment } from '../astro.c3a57b74.mjs';
import 'html-escaper';
/* empty css                           */import { readFile, writeFile } from 'fs/promises';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body>
    ${renderSlot($$result, $$slots["default"])}
  </body></html>`;
}, "/Users/admin/Code/astro-client-generator/example/todo-list/src/layouts/Layout.astro");

const getTodos = async (options = {}) => {
  let requestUrl = "http://localhost:3002/api/get-todos";
  if (options && options.query) {
    requestUrl += "?" + Object.keys(options.query).map((key) => key + "=" + options.query[key]).join("&");
  }
  delete options.query;
  options.method = "GET";
  return (await fetch(requestUrl, options)).json();
};

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getTodos
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const todos = await getTodos();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "class": "astro-J7PV25F6" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="astro-J7PV25F6">
    <h1 class="astro-J7PV25F6"><span class="text-gradient astro-J7PV25F6">@jsheaven/astro-client-generator</span></h1>

    <p class="instructions astro-J7PV25F6">
      Find the API endpoints implemented in <code class="astro-J7PV25F6">src/pages/api/*.ts</code>.<br class="astro-J7PV25F6">
      <strong class="astro-J7PV25F6">Code Challenge:</strong> Checkout the generated <code class="astro-J7PV25F6">src/pages/api-client/*</code> files and
      <code class="astro-J7PV25F6">src/pages/index.astro</code> and how the API client generation works.
    </p>

    <h3 class="astro-J7PV25F6">My TODOs:</h3>
    ${// render todos
  todos.todos.map((todo) => renderTemplate`<li class="astro-J7PV25F6">
          <input type="checkbox" name="todo-is-done"${addAttribute(JSON.stringify(todo), "data-todo")}${addAttribute(todo.isDone ? "true" : "false", "aria-checked")}${addAttribute(todo.isDone, "checked")} class="astro-J7PV25F6">
          ${todo.task}
          <button name="todo-delete"${addAttribute(JSON.stringify(todo), "data-todo")} class="astro-J7PV25F6">
            Delete
          </button>
        </li>`)}
    <p class="instructions astro-J7PV25F6">
      <span class="text-gradient astro-J7PV25F6"><strong class="astro-J7PV25F6">Add another TODO:</strong></span>
      <input id="add-todo-input" type="text" value="" placeholder="My new todo..." class="astro-J7PV25F6">
      <button id="add-todo-button" class="astro-J7PV25F6">Add</button>
    </p>

    
  </main>` })}`;
}, "/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/index.astro");

const $$file = "/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/index.astro";
const $$url = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const createTodo = async (payload, options = {}) => {
  let requestUrl = "http://localhost:3002/api/create-todo";
  if (options && options.query) {
    requestUrl += "?" + Object.keys(options.query).map((key) => key + "=" + options.query[key]).join("&");
  }
  delete options.query;
  options.method = "POST";
  options.body = JSON.stringify(payload);
  return (await fetch(requestUrl, options)).json();
};

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  createTodo
}, Symbol.toStringTag, { value: 'Module' }));

const removeTodo = async (payload, options = {}) => {
  let requestUrl = "http://localhost:3002/api/remove-todo";
  if (options && options.query) {
    requestUrl += "?" + Object.keys(options.query).map((key) => key + "=" + options.query[key]).join("&");
  }
  delete options.query;
  options.method = "DELETE";
  options.body = JSON.stringify(payload);
  return (await fetch(requestUrl, options)).json();
};

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  removeTodo
}, Symbol.toStringTag, { value: 'Module' }));

const updateTodo = async (payload, options = {}) => {
  let requestUrl = "http://localhost:3002/api/update-todo";
  if (options && options.query) {
    requestUrl += "?" + Object.keys(options.query).map((key) => key + "=" + options.query[key]).join("&");
  }
  delete options.query;
  options.method = "PATCH";
  options.body = JSON.stringify(payload);
  return (await fetch(requestUrl, options)).json();
};

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  updateTodo
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<h1 id=\"api-client\">api-client</h1>\n<p>All files in this folder are auto-generated by <code>@jsheaven/astro-client-generator</code></p>";

				const frontmatter = {};
				const file = "/Users/admin/Code/astro-client-generator/example/todo-list/src/pages/api-client/README.md";
				const url = "/api-client/README";
				function rawContent() {
					return "# api-client\n\nAll files in this folder are auto-generated by `@jsheaven/astro-client-generator`\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"api-client","text":"api-client"}];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content,
  compiledContent,
  default: Content,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
}, Symbol.toStringTag, { value: 'Module' }));

const post = async ({ request }) => {
  let todos = [];
  const body = await request.json();
  try {
    todos = JSON.parse(await readFile("./todos.json", { encoding: "utf-8" }));
  } catch (e) {
  }
  const mostRecentTodo = todos[todos.length - 1] || { id: 0 };
  todos.push({
    id: mostRecentTodo.id + 1,
    task: body.task,
    isDone: body.isDone
  });
  try {
    await writeFile("./todos.json", JSON.stringify(todos), { encoding: "utf-8" });
  } catch (e) {
  }
  return new Response(
    JSON.stringify({
      status: "SUCCESS",
      todos
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const del = async ({ request }) => {
  let todos = [];
  const body = await request.json();
  try {
    todos = JSON.parse(await readFile("./todos.json", { encoding: "utf-8" }));
  } catch (e) {
  }
  todos = todos.filter((todo) => todo.id !== body.id);
  try {
    await writeFile("./todos.json", JSON.stringify(todos), { encoding: "utf-8" });
  } catch (e) {
  }
  return new Response(
    JSON.stringify({
      status: "SUCCESS",
      todos
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  del
}, Symbol.toStringTag, { value: 'Module' }));

const patch = async ({ request }) => {
  let todos = [];
  const body = await request.json();
  try {
    todos = JSON.parse(await readFile("./todos.json", { encoding: "utf-8" }));
  } catch (e) {
  }
  todos.forEach((todo) => {
    if (body.id === todo.id) {
      if (body.isDone !== todo.isDone) {
        todo.isDone = body.isDone;
      }
      if (body.task !== todo.task) {
        todo.task = body.task;
      }
    }
  });
  try {
    await writeFile("./todos.json", JSON.stringify(todos), { encoding: "utf-8" });
  } catch (e) {
  }
  return new Response(
    JSON.stringify({
      status: "SUCCESS",
      todos
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  patch
}, Symbol.toStringTag, { value: 'Module' }));

const get = async ({ params, request, url }) => {
  let todos = [];
  try {
    todos = JSON.parse(await readFile("./todos.json", { encoding: "utf-8" }));
  } catch (e) {
  }
  return new Response(
    JSON.stringify({
      status: "SUCCESS",
      todos
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d, _page5 as e, _page6 as f, _page7 as g, _page8 as h, _page9 as i };
