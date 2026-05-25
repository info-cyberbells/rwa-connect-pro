// Prepend base URL to a relative path
// DB mein save: "/uploads/complaints/1234.jpg"
// Frontend ko bhejte: "http://localhost:4000/uploads/complaints/1234.jpg"

export function toFullUrl(req, relativePath) {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath; // already full URL
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

// Process a single object — add base URL to specified fields
export function attachBaseUrl(req, obj, singleFields = [], arrayFields = []) {
  if (!obj) return obj;
  const data = typeof obj.toObject === "function" ? obj.toObject() : { ...obj };

  for (const field of singleFields) {
    if (field.includes(".")) {
      // nested field like "kyc.governmentIdUrl"
      const parts = field.split(".");
      let target = data;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) break;
        target = target[parts[i]];
      }
      const lastKey = parts[parts.length - 1];
      if (target && target[lastKey]) {
        target[lastKey] = toFullUrl(req, target[lastKey]);
      }
    } else if (data[field]) {
      data[field] = toFullUrl(req, data[field]);
    }
  }

  for (const field of arrayFields) {
    if (data[field] && Array.isArray(data[field])) {
      data[field] = data[field].map((url) => toFullUrl(req, url));
    }
  }

  return data;
}

// Process an array of objects
export function attachBaseUrlToArray(req, arr, singleFields = [], arrayFields = []) {
  if (!arr) return arr;
  return arr.map((item) => attachBaseUrl(req, item, singleFields, arrayFields));
}
