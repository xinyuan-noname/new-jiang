export class EditorOrganize {
    static testSentenceIsOk(str) {
        try {
            new Function(str);
        } catch (err) {
            if (err) return false;
        }
        return true;
    }
}
