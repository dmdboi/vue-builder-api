import { JSONToHTML } from "html-to-json-parser";
import ejs from "ejs";

import Content from "../models/Content";
import { ContentBody, RepeatableData } from "../types/Content";

/**
 * Get all components in a template.
 * @param data
 * @returns
 */
const getComponentsInTemplate = async (data: any) => {
  const componentRefs = data.content[0].content.filter((c: any) => c.type === "component");

  const components = await Content.find({
    type: "component",
    ref: { $in: componentRefs.map((c: any) => c.ref) },
  });

  // Check if each component exists
  const missingComponents = componentRefs.filter((c: any) => !components.find((comp: any) => comp.ref === c.ref));

  if (missingComponents.length > 0) {
    return { message: "Error", error: "Component not found", components: missingComponents };
  }

  return { message: "Success", components };
};

/**
 * Replace component references in a page with the actual component data.
 * @param data
 * @param components
 * @returns
 */
const replaceComponentRefs = async (data: any, components: any) => {
  // Replace the component refs with the actual component data in page.content
  data.content[0].content = await Promise.all(
    data.content[0].content.map((c: any) => {
      if (c.type === "component") {
        const component = components.find((comp: any) => comp.ref === c.ref);

        return component.content[0];
      }

      return c;
    })
  );

  return data;
};

/**
 * Render the given page data into HTML using ejs templates.
 * @param data
 * @returns
 */
const renderPageHTML = async (data: any) => {
  // Turn the page content into HTML
  const tempHTML = await JSONToHTML(data.content[0]);

  // Replace template variables with actual data
  const template = ejs.compile(tempHTML as string);
  return template(data.data);
};

/**
 * Recursively find all components in a content object and return them in a structured format.
 * @param node
 * @returns
 * @deprecated This function is not used in the current implementation.
 */
const findAllComponents = async (node: any) => {
  if (node && typeof node.content[0] === "string") {
    console.log("End node", node);
    return {
      type: node.type,
      name: node.name,
      content: node.content,
      isEndNode: true,
    };
  }

  if (node && typeof node.content[0] === "object") {
    console.log("Node with children", node);
    return {
      type: node.type,
      name: node.name || node.type,
      children: await Promise.all(node.content.map(async (childNode: any) => await findAllComponents(childNode))),
      isEndNode: false,
    };
  }

  return null;
};

/**
 * Recursively find all repeatable content objects in a content array and return them in an array for further processing.
 * @param contentArray
 * @returns
 */
const findRepeatableContent = async (contentArray: Array<string | ContentBody>): Promise<ContentBody[]> => {
  let repeatableItems: ContentBody[] = [];

  // Helper function to recursively traverse content fields
  function traverseContent(content: string | ContentBody) {
    if (typeof content === "object" && "repeatable" in content) {
      // If the content is an object and has the "repeatable" field, add it to the array
      repeatableItems.push(content);
    }

    // If the content is an object and contains nested content, recursively process it
    if (typeof content === "object" && Array.isArray(content.content)) {
      content.content.forEach(traverseContent); // Recursively process nested content
    }
  }

  // Start traversal with the top-level content array
  contentArray.forEach(traverseContent);

  return repeatableItems; // Return the array of repeatable content objects
};

/**
 * Build repeatable content from a repeatable content object.
 */
const buildRepeatableContent = async (template: ContentBody, data: RepeatableData[]) => {
  let newContentArray: ContentBody[] = [];

  let repeatable = template.repeatable;

  data.forEach(item => {
    // Clone the template object for each item in the data array
    const clonedItem: ContentBody = JSON.parse(JSON.stringify(template));

    // Ensure there is an "a" tag in the content to modify
    const anchorElement = clonedItem.content[0];

    // Delete "repeatable" field from the cloned object
    if ("repeatable" in clonedItem) {
      delete clonedItem.repeatable;
    }

    // Replace the placeholder with the actual data
    if (typeof anchorElement === "string") {
      clonedItem.content[0] = item.key;
    }

    // If the content is an object and is an anchor element
    if (typeof anchorElement === "object" && anchorElement.type === "a") {
      // Replace the href placeholder ':value' with the actual slug
      if (anchorElement.attributes && anchorElement.attributes.href) {
        anchorElement.attributes.href = anchorElement.attributes.href.replace(":value", item.value);
      }

      // Replace the content (anchor text) with the name
      anchorElement.content = [item.key];
    }

    // Add the newly populated object to the array
    newContentArray.push(clonedItem);
  });

  return {
    type: template.type,
    repeatable,
    content: newContentArray,
  };
};

/**
 * Insert repeatable content into the content array.
 */
const insertRepeatableContent = async (contentArray: Array<string | ContentBody>, repeatableContent: ContentBody[], repeatableKey: string) => {
  // Helper function to recursively traverse content fields, keeping track of the parent
  function traverseContent(content: string | ContentBody, parent: ContentBody | null = null, parentIndex: number | null = null) {
    if (typeof content === "object" && "repeatable" in content && content.repeatable === repeatableKey) {
      // If the content has the "repeatable" field, replace the parent's content array at the appropriate index
      if (parent && parentIndex !== null) {
        parent.content.splice(parentIndex, 1, ...repeatableContent); // Replace the parent's content array with the repeatable content
      }
    }

    // If the content has nested content, recursively process it
    if (typeof content === "object" && Array.isArray(content.content)) {
      content.content.forEach((childContent, index) => {
        traverseContent(childContent, content, index); // Pass the current content as the parent
      });
    }
  }

  // Start traversal with the top-level content array
  contentArray.forEach((content, index) => traverseContent(content, null, index));

  return contentArray; // Return the updated content array
};

export { getComponentsInTemplate, replaceComponentRefs, renderPageHTML, findAllComponents, findRepeatableContent, buildRepeatableContent, insertRepeatableContent };
