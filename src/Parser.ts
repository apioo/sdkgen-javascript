
export class Parser {

    private readonly baseUrl: string;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public url(path: string, parameters: Record<string, string>): string {

        let url = this.baseUrl;
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        if (path.startsWith('/')) {
            path = path.substring(1);
        }

        return this.substituteParameters(url + '/' + path, parameters)
    }

    public query(parameters: Record<string, string>): Record<string, string> {
        let result: Record<string, string> = {};
        for (const [name, value] of Object.entries(parameters)) {
            if (value === null || value === undefined) {
                continue;
            }

            result[name] = value;
        }

        return result;
    }

    private substituteParameters(url: string, parameters: Record<string, string>): string {
        for (const [name, value] of Object.entries(parameters)) {
            if (value === null || value === undefined) {
                continue;
            }

            url = url.replace(':' + name, value);
        }

        return url;
    }
}
