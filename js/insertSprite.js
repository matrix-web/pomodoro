const insert2body = (html) => {
  const div = document.createElement("div")
  div.innerHTML = html
  div.style.display = "none"
  document.documentElement.prepend(div)
}

(async () => {
  if (typeof window !== "undefined" && "caches" in window) {
    const spriteLink = "../sprite.svg";
    const newCache = await caches.open("sprite")
    const options = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "image/svg+xml"
      })
    }
    let response = await newCache.match(spriteLink)
    let html = null

    if (!response) {
      const req = new Request(spriteLink, options)
      await newCache.add(req)
      response = await newCache.match(spriteLink)
      html = await response?.text()
      insert2body(html || "")
      return;
    }

    html = await response.text()
    insert2body(html)
  }
})()