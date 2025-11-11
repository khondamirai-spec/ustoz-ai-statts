import type { User } from "./types";

// Static fake users data for all regions
export const users: User[] = [
  // Khorezm/Xorazm users
  { name: "Akmal Karimov", city: "khorezm", age: 25, joinedAt: "2023-01-15T10:30:00.000Z" },
  { name: "Bekzod Toshmatov", city: "khorezm", age: 28, joinedAt: "2023-02-20T14:15:00.000Z" },
  { name: "Davron Nizomov", city: "xorazm", age: 32, joinedAt: "2023-03-10T09:45:00.000Z" },
  { name: "Elyor Rahimov", city: "xorazm", age: 24, joinedAt: "2023-04-05T16:20:00.000Z" },
  { name: "Farhod Yusupov", city: "khorezm", age: 29, joinedAt: "2023-05-12T11:00:00.000Z" },
  
  // Ferghana/Farg'ona users
  { name: "G'ayrat Alimov", city: "ferghana", age: 26, joinedAt: "2023-01-20T13:30:00.000Z" },
  { name: "Hasan Hasanov", city: "ferghana", age: 31, joinedAt: "2023-02-15T10:15:00.000Z" },
  { name: "Ibrohim Ibrohimov", city: "farg'ona", age: 27, joinedAt: "2023-03-25T15:45:00.000Z" },
  { name: "Jahongir Jalilov", city: "farg'ona", age: 23, joinedAt: "2023-04-18T12:30:00.000Z" },
  { name: "Kamol Kamolov", city: "ferghana", age: 30, joinedAt: "2023-05-08T14:00:00.000Z" },
  
  // Andijon users
  { name: "Laziz Murodov", city: "andijon", age: 25, joinedAt: "2023-01-10T09:20:00.000Z" },
  { name: "Murod Nodirov", city: "andijon", age: 28, joinedAt: "2023-02-22T11:45:00.000Z" },
  { name: "Nodir Olimov", city: "andijon", age: 26, joinedAt: "2023-03-15T13:10:00.000Z" },
  { name: "Olim Qodirov", city: "andijon", age: 29, joinedAt: "2023-04-20T10:30:00.000Z" },
  { name: "Po'lat Rustamov", city: "andijon", age: 24, joinedAt: "2023-05-05T15:20:00.000Z" },
  
  // Surxondaryo/Surkhandarya users
  { name: "Qodir Sardorov", city: "surkhandarya", age: 27, joinedAt: "2023-01-25T12:00:00.000Z" },
  { name: "Rustam Temurov", city: "surxondaryo", age: 31, joinedAt: "2023-02-18T14:30:00.000Z" },
  { name: "Sardor Umidov", city: "surkhandarya", age: 25, joinedAt: "2023-03-20T09:15:00.000Z" },
  { name: "Temur Vohidov", city: "surxondaryo", age: 28, joinedAt: "2023-04-12T11:45:00.000Z" },
  { name: "Umid Xurshidov", city: "surkhandarya", age: 26, joinedAt: "2023-05-15T13:20:00.000Z" },
  
  // Jizzax users
  { name: "Vohid Yusupov", city: "jizzax", age: 29, joinedAt: "2023-01-30T10:00:00.000Z" },
  { name: "Xurshid Zafarov", city: "jizzax", age: 24, joinedAt: "2023-02-25T15:30:00.000Z" },
  { name: "Yusuf Karimov", city: "jizzax", age: 27, joinedAt: "2023-03-18T12:15:00.000Z" },
  { name: "Zafar Toshmatov", city: "jizzax", age: 30, joinedAt: "2023-04-22T14:45:00.000Z" },
  
  // Namangan users
  { name: "Aziza Karimova", city: "namangan", age: 23, joinedAt: "2023-01-15T11:20:00.000Z" },
  { name: "Baxora Toshmatova", city: "namangan", age: 26, joinedAt: "2023-02-20T13:45:00.000Z" },
  { name: "Dilnoza Nizomova", city: "namangan", age: 25, joinedAt: "2023-03-12T10:30:00.000Z" },
  { name: "Elena Rahimova", city: "namangan", age: 28, joinedAt: "2023-04-18T15:00:00.000Z" },
  
  // Buxoro users
  { name: "Fotima Yusupova", city: "buxoro", age: 24, joinedAt: "2023-01-22T12:30:00.000Z" },
  { name: "Gulnora Alimova", city: "buxoro", age: 27, joinedAt: "2023-02-28T14:15:00.000Z" },
  { name: "Hilola Hasanova", city: "buxoro", age: 26, joinedAt: "2023-03-25T11:45:00.000Z" },
  
  // Samarqand users
  { name: "Iroda Ibrohimova", city: "samarqand", age: 29, joinedAt: "2023-01-18T13:20:00.000Z" },
  { name: "Jasmina Jalilova", city: "samarqand", age: 25, joinedAt: "2023-02-24T10:30:00.000Z" },
  { name: "Kamola Kamolova", city: "samarqand", age: 28, joinedAt: "2023-03-20T15:15:00.000Z" },
  
  // Toshkent users
  { name: "Laylo Murodova", city: "toshkent", age: 26, joinedAt: "2023-01-25T12:00:00.000Z" },
  { name: "Madina Nodirova", city: "toshkent", age: 24, joinedAt: "2023-02-22T14:30:00.000Z" },
  { name: "Nigora Olimova", city: "toshkent", age: 27, joinedAt: "2023-03-18T11:15:00.000Z" },
  
  // Qashqadaryo users
  { name: "Oydin Qodirova", city: "qashqadaryo", age: 25, joinedAt: "2023-01-20T13:45:00.000Z" },
  { name: "Parvina Rustamova", city: "qashqadaryo", age: 28, joinedAt: "2023-02-26T10:20:00.000Z" },
  
  // Qoraqalpog'iston users
  { name: "Qumri Sardorova", city: "qoraqalpog'iston", age: 26, joinedAt: "2023-01-28T15:00:00.000Z" },
  { name: "Rano Temurova", city: "qoraqalpog'iston", age: 24, joinedAt: "2023-02-24T12:30:00.000Z" },
  
  // Navoiy users
  { name: "Sabina Umidova", city: "navoiy", age: 27, joinedAt: "2023-01-22T11:15:00.000Z" },
  
  // Sirdaryo users
  { name: "Tanzila Vohidova", city: "sirdaryo", age: 25, joinedAt: "2023-01-30T14:45:00.000Z" },
];

// Export default for compatibility
export default users;
