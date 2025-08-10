declare const _default: (() => {
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    ssl: {
        require: boolean;
        rejectUnauthorized: boolean;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    ssl: {
        require: boolean;
        rejectUnauthorized: boolean;
    };
}>;
export default _default;
