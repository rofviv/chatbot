export default class Utils {

  static fixJSON(rawJSON: string): object | null {
    try {
      return JSON.parse(rawJSON);
    } catch {
      const fixedJSON = rawJSON.replace(/,\s*(?=[}\]])/g, "");
      try {
        return JSON.parse(fixedJSON);
      } catch (error) {
        return null;
      }
    }
  }

}

