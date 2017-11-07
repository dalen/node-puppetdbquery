export interface Query extends Array<string | number | boolean | null | Query> {}

export declare function parse(query: string): Query;
