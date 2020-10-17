const nodeFetch = require("node-fetch")

export function loadJson(url: string) : Promise<any> {
    return nodeFetch(url)
      .then((response: any) => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error(response.error);
        }
      })
  }