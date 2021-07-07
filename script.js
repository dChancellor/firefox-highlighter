let prefix = "ds-highlight";

async function init(request, sender, sendResponse) {
  let backCover = await createThing("div", "backCover", "body");
  let modal = await createThing("div", "modal", "body");
  let form = await createThing("form", "form", modal);

  let selection = await createThing(
    "input",
    "selection",
    form,
    "Highlighted Text: "
  );
  selection.value = request.highlight;
  selection.setAttribute("disabled", true);
  let url = await createThing("input", "url", form, "Source: ");
  url.value = request.website;
  url.setAttribute("disabled", true);
  let notes = await createThing("textarea", "notes", form, "Notes: ");
  notes.setAttribute("placeholder", "Write your notes here...");
  let tags = await createThing("input", "tagify", form, "Tags: ");
  let tagify = new Tagify(tags, {
    dropdown: {
      enabled: 0,
    },
    whitelist: ["test", "test2", "test3"],
  });
  tagify.addTags();

  let submit = await createThing("button", "submit-button", form);
  submit.innerHTML = "Submit";

  backCover.addEventListener(
    "click",
    (event) => {
      if (event.target.id === `${prefix}-modal`) {
        event.stopPropagation();
      }
      modal.remove();
      backCover.remove();
      browser.runtime.sendMessage({
        message: "closed",
        tab: request.tab,
      });
    },
    true
  );
}

function createThing(type, name, parent, labelText) {
  return new Promise((resolve) => {
    let element = document.createElement(type);
    if (labelText) {
      let label = document.createElement("label");
      label.setAttribute("for", name);
      label.setAttribute("class", `${prefix}-label`);
      parent.appendChild(label);
      label.innerHTML = labelText;
    }
    element.setAttribute("id", `${prefix}-${name}`);
    parent === "body"
      ? document.body.appendChild(element)
      : parent.appendChild(element);
    resolve(element);
  });
}
browser.runtime.onMessage.addListener(init);
