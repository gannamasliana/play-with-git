// index.ts
// Main file that defines the JSON structure, sends an API request, converts the data,
// and demonstrates the usage of the classes and composition defined in abstraction.ts.

import { ApiRequest, Converter, DataService } from './abstraction';

// Define interfaces for the JSON structure returned by the API (User with nested objects).

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

// Define a summary interface to hold brief user information.
interface UserSummaryData {
  name: string;
  email: string;
  companyName: string;
  addressSummary: string;
}

// Implement a concrete class for sending an API request to fetch a User.
class UserApiRequest extends ApiRequest<User> {
  async fetchData(url: string): Promise<User> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data as User;
  }
}

// Implement a converter that converts a User object into a summary version (UserSummaryData).
class UserConverter extends Converter<User, UserSummaryData> {
  convert(user: User): UserSummaryData {
    // Create a brief address summary.
    const addressSummary = `${user.address.street}, ${user.address.city}`;
    return {
      name: user.name,
      email: user.email,
      companyName: user.company.name,
      addressSummary: addressSummary,
    };
  }
}

// Alternatively, we can implement a conversion class where the conversion logic resides in the constructor.
class UserSummary {
  name: string;
  email: string;
  companyName: string;
  addressSummary: string;

  constructor(user: User) {
    // Conversion logic in the constructor
    this.name = user.name;
    this.email = user.email;
    this.companyName = user.company.name;
    this.addressSummary = `${user.address.street}, ${user.address.city}`;
  }
}

// Main function to tie everything together.
async function main() {
  // API URL for a user from JSONPlaceholder.
  const url = 'https://jsonplaceholder.typicode.com/users/1';

  // Create instances of our concrete classes.
  const userApi = new UserApiRequest();
  const userConverter = new UserConverter();

  // Compose our service using the DataService class.
  const dataService = new DataService<User, UserSummaryData>(userApi, userConverter);

  try {
    // Use the composed service to fetch and convert data.
    const userSummaryData = await dataService.getConvertedData(url);
    console.log('User Summary Data from Converter:', userSummaryData);

    // Alternatively, fetch the user and convert directly using the UserSummary class.
    const user = await userApi.fetchData(url);
    const userSummary = new UserSummary(user);
    console.log('User Summary from Constructor:', userSummary);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Execute the main function.
main();
