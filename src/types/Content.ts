interface Content {
  id: string;
  name: string;
  ref: string;
  type: "page" | "component" | "template";
  content: Content[] | string[];
  data: Record<string, any>;
  html: string;
}

interface ContentBody {
  repeatable?: string;
  type: string;
  attributes?: {
    href?: string;
    src?: string;
    alt?: string;
    style?: string;
    class?: string;
  };
  content: Array<string | ContentBody>;
}

interface ContentData {
  [key: string]: RepeatableData | string | number | boolean | null;
}

interface RepeatableData {
  key: string;
  value: string;
}

interface StoreContentRequest {
  name: string;
  type: "page" | "component" | "template";
  content: ContentBody[];
  data: ContentData;
}

export { Content, ContentData, RepeatableData, StoreContentRequest, ContentBody };
