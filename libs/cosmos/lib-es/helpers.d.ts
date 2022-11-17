declare type Message = {
    type: string;
    attributes: {
        [key: string]: any;
    };
};
export declare const getMainMessage: (messages: Message[]) => Message;
export {};
//# sourceMappingURL=helpers.d.ts.map