import { PRSuggestion } from '../constants';
export class PRSuggestionClass implements PRSuggestion {
    describe: string;
    type: string;
    comment: string;
    code: string;
    filename: string;
    constructor(describe: string, type: string, comment: string, code: string, filename: string) {
        this.describe = describe;
        this.type = type;
        this.comment = comment;
        this.code = code;
        this.filename = filename;
    }
    toString(): string {
        let xmlString = `<prsuggestion>
`;
        xmlString += `	<describe>${this.describe}</describe>
`;
        xmlString += `	<type>${this.type}</type>
`;
        xmlString += `	<comment>${this.comment}</comment>
`;
        xmlString += `	<code>${this.code}</code>
`;
        xmlString += `	<filename>${this.filename}</filename>
`;
        xmlString += `</prsuggestion>`;
        return xmlString;
    }
}