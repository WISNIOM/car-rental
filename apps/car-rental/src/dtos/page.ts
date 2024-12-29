import { PageMeta } from "./page-meta";

export type Page<T> = {
    data: T[];
    meta: PageMeta;
}