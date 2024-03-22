type Options = { pre?; post?; skipProperty? };

export function simpleTraverse(root, options: Options = {}) {
  var pre = options.pre;
  var post = options.post;
  var skipProperty = options.skipProperty;

  function visit(node, parent, prop?, idx?) {
    if (!node || typeof node.type !== "string") return;

    var res = undefined;
    if (pre) res = pre(node, parent, prop, idx);

    if (res !== false) {
      for (const prop in node) {
        if (skipProperty ? skipProperty(prop, node) : prop[0] === "$") continue;
        const child = node[prop];
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i++) visit(child[i], node, prop, i);
        } else visit(child, node, prop);
      }
    }

    if (post) post(node, parent, prop, idx);
  }

  visit(root, null);
}

export const Mock = new Proxy({ fn: {} } as any, {
  get(target, name, receiver) {
    return { type: "Identifier", name };
  },
});

const isObject = (item) =>
  item && typeof item === "object" && !Array.isArray(item);

export function find(node, match) {
  //
  if (typeof node != "object" || node === null) return;

  const recursive = (object: Object) => {
    //
    if (match(object)) return object;

    if (Array.isArray(object)) {
      for (const val of object) {
        const res = recursive(val);
        if (res) return res;
      }
      return;
    }

    for (const i in object) {
      const value = object[i];
      if (typeof value != "object" || value === null) continue;
      const res = recursive(value);
      if (res) return res;
    }
  };

  return recursive(node);
}

export function mutate(object, match, modifier) {
  const findAndModify = (object) => {
    if (isObject(object)) {
      if (match(object)) return modifier(object);
      const newObj = {};
      let changed = false;
      for (const [k, v] of Object.entries(object)) {
        const newValue = findAndModify(v);
        newObj[k] = newValue;
        if (newValue !== v) changed = true;
      }
      return changed ? newObj : object;
    }
    if (Array.isArray(object)) {
      const newArray = object.map(findAndModify);
      return newArray.some((item, index) => item !== object[index])
        ? newArray
        : object;
    }
    return object;
  };
  return findAndModify(object);
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result as Pick<T, K>;
}
