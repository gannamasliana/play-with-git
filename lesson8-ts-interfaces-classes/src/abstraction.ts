// abstraction.ts
// This file demonstrates abstraction, inheritance, and composition for our API request and conversion logic.

export abstract class ApiRequest<T> {
    // Abstract method to fetch data from a given URL and return a Promise of type T.
    abstract fetchData(url: string): Promise<T>;
  }
  
  export abstract class Converter<T, U> {
    // Abstract method to convert data of type T into type U.
    abstract convert(data: T): U;
  }
  
  // DataService composes an ApiRequest and a Converter to provide high-level data retrieval and conversion.
  export class DataService<T, U> {
    constructor(
      private apiRequest: ApiRequest<T>,
      private converter: Converter<T, U>
    ) {}
  
    // Fetches the data using the apiRequest, converts it using the converter, and returns the converted data.
    async getConvertedData(url: string): Promise<U> {
      const data = await this.apiRequest.fetchData(url);
      return this.converter.convert(data);
    }
  }
  