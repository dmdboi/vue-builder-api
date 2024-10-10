type Content = string | ContentBody; // Content can be a string or an object
type ContentBody = {
  type: string;
  ref?: string;
  content?: Content[];
};

/**
 * Recursively find all components in a template and return them in an array for further processing.
 * @param data
 * @returns
 */
const getComponentsInTemplate = async (content: Array<ContentBody>) => {
  let components: any[] = [];

  function traverseContent(content: string | ContentBody) {
    if (typeof content === "string") return;

    if (typeof content === "object" && content.type === "component") {
      components.push(content);
    }

    if (typeof content === "object" && Array.isArray(content.content)) {
      content.content.forEach(traverseContent);
    }
  }

  // Start traversal with the top-level content array
  if (Array.isArray(content)) {
    content.forEach(traverseContent);
  }

  return {
    message: "Success",
    components,
  };
};

/**
 * Replace component references in a page with the actual component data.
 * @param data
 * @param components
 * @returns
 */
const replaceComponentRefs = (content: Content[], components: ContentBody[]): Content[] => {
  // Traverse and replace component references in the content
  function traverseContent(item: Content): Content {
    if (typeof item === "string") return item; // Base case: if it's a string, return it as is

    if (item.type === "component" && item.ref) {
      // Find the corresponding component from the components array by ref
      const component = components.find(c => c.ref === item.ref);
      if (component && component.content) {
        // Recursively process and replace the component's content
        // @ts-ignore
        return component.content.map(traverseContent) as Content[]; // Ensure recursion
      }
    }

    if (Array.isArray(item.content)) {
      // If the content is an array, recursively traverse each item
      return {
        ...item,
        content: item.content.map(traverseContent),
      };
    }

    return item; // Return the content unchanged if it's not a component or array
  }

  // Start traversal with the top-level content array and return the modified array
  return content.map(traverseContent).flat(Infinity);
};

export { getComponentsInTemplate, replaceComponentRefs };
