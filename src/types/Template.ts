import { Content } from "./Content";

interface Template {
  id: string;
  name: string;
  ref: string;
  content: Content[] | string[];
  data: Record<string, any>;
  meta: Record<string, any>;

  placeholder?: string;
}

export { Template };
