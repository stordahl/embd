var Embd = (() => {
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_current_component(component) {
    current_component = component;
  }
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var tasks, is_hydrating, managed_styles, current_component, dirty_components, binding_callbacks, render_callbacks, flush_callbacks, resolved_promise, update_scheduled, seen_callbacks, flushidx, outroing, globals, boolean_attributes, SvelteElement, SvelteComponent;
  var init_internal = __esm({
    "node_modules/svelte/internal/index.mjs"() {
      tasks = new Set();
      is_hydrating = false;
      managed_styles = new Map();
      dirty_components = [];
      binding_callbacks = [];
      render_callbacks = [];
      flush_callbacks = [];
      resolved_promise = Promise.resolve();
      update_scheduled = false;
      seen_callbacks = new Set();
      flushidx = 0;
      outroing = new Set();
      globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
      boolean_attributes = new Set([
        "allowfullscreen",
        "allowpaymentrequest",
        "async",
        "autofocus",
        "autoplay",
        "checked",
        "controls",
        "default",
        "defer",
        "disabled",
        "formnovalidate",
        "hidden",
        "ismap",
        "loop",
        "multiple",
        "muted",
        "nomodule",
        "novalidate",
        "open",
        "playsinline",
        "readonly",
        "required",
        "reversed",
        "selected"
      ]);
      if (typeof HTMLElement === "function") {
        SvelteElement = class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: "open" });
          }
          connectedCallback() {
            const { on_mount } = this.$$;
            this.$$.on_disconnect = on_mount.map(run).filter(is_function);
            for (const key in this.$$.slotted) {
              this.appendChild(this.$$.slotted[key]);
            }
          }
          attributeChangedCallback(attr2, _oldValue, newValue) {
            this[attr2] = newValue;
          }
          disconnectedCallback() {
            run_all(this.$$.on_disconnect);
          }
          $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
          }
          $on(type, callback) {
            const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
            callbacks.push(callback);
            return () => {
              const index = callbacks.indexOf(callback);
              if (index !== -1)
                callbacks.splice(index, 1);
            };
          }
          $set($$props) {
            if (this.$$set && !is_empty($$props)) {
              this.$$.skip_bound = true;
              this.$$set($$props);
              this.$$.skip_bound = false;
            }
          }
        };
      }
      SvelteComponent = class {
        $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
        }
        $on(type, callback) {
          const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
          callbacks.push(callback);
          return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
              callbacks.splice(index, 1);
          };
        }
        $set($$props) {
          if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
          }
        }
      };
    }
  });

  // fakecss:/Users/stordahl/code/embeddable/src/WidgetBase.esbuild-svelte-fake-css
  var init_ = __esm({
    "fakecss:/Users/stordahl/code/embeddable/src/WidgetBase.esbuild-svelte-fake-css"() {
    }
  });

  // src/WidgetBase.svelte
  function create_fragment(ctx) {
    let button;
    let t;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        t = text(ctx[0]);
        attr(button, "class", "svelte-1yj9ulj");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t);
        if (!mounted) {
          dispose = listen(button, "click", function() {
            if (is_function(ctx[1]))
              ctx[1].apply(this, arguments);
          });
          mounted = true;
        }
      },
      p(new_ctx, [dirty]) {
        ctx = new_ctx;
        if (dirty & 1)
          set_data(t, ctx[0]);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(button);
        mounted = false;
        dispose();
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let { text: text2 } = $$props;
    let { callback } = $$props;
    $$self.$$set = ($$props2) => {
      if ("text" in $$props2)
        $$invalidate(0, text2 = $$props2.text);
      if ("callback" in $$props2)
        $$invalidate(1, callback = $$props2.callback);
    };
    return [text2, callback];
  }
  var WidgetBase, WidgetBase_default;
  var init_WidgetBase = __esm({
    "src/WidgetBase.svelte"() {
      init_internal();
      init_();
      WidgetBase = class extends SvelteComponent {
        constructor(options) {
          super();
          init(this, options, instance, create_fragment, safe_not_equal, { text: 0, callback: 1 });
        }
      };
      WidgetBase_default = WidgetBase;
    }
  });

  // src/utils.js
  var initializeState, getTarget;
  var init_utils = __esm({
    "src/utils.js"() {
      initializeState = (target, props, componentConstructor) => {
        let component = new componentConstructor({
          target: getTarget(target),
          props
        });
        return { component };
      };
      getTarget = (target) => {
        if (target instanceof HTMLElement) {
          return target;
        } else if (typeof target === "string") {
          let el = document.getElementById(target);
          if (el) {
            return el;
          } else {
            console.error("Could not find target element for", target);
          }
        } else {
          console.error("Could not find target element for", target);
        }
      };
    }
  });

  // src/widget.js
  var require_widget = __commonJS({
    "src/widget.js"(exports, module) {
      init_WidgetBase();
      init_utils();
      var Widget = class {
        constructor({ target, props }) {
          this.target = target;
          this.props = { ...props };
          let { component } = initializeState(target, props, WidgetBase_default);
          this.component = component;
        }
        destroy() {
          this.component?.$destroy();
        }
      };
      module.exports = { Widget };
    }
  });
  return require_widget();
})();
