export declare type CacheRes<A extends Array<any>, T> = {
    (...args: A): Promise<T>;
    force: (...args: A) => Promise<T>;
    hydrate: (arg0: string, arg1: T) => void;
    clear: (arg0: string) => void;
    reset: () => void;
};
export declare const makeLRUCache: <A extends any[], T>(f: (...args: A) => Promise<T>, keyExtractor?: (...args: A) => string, lruOpts?: Record<string, any>) => CacheRes<A, T>;
//# sourceMappingURL=cache.d.ts.map