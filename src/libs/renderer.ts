import { JSONToHTML } from "html-to-json-parser";
import ejs from "ejs";

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

export { renderPageHTML };
