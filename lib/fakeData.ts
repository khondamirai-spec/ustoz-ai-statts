import type { User } from "./types";

export const users: User[] = [
  { name: "Ali Tursunov", age: 27, city: "Tashkent", joinedAt: "2024-09-12" },
  { name: "Laylo Karimova", age: 24, city: "Tashkent", joinedAt: "2024-08-04" },
  { name: "Murod Yuldashev", age: 31, city: "Tashkent", joinedAt: "2024-05-23" },
  { name: "Nilufar Rakhimova", age: 29, city: "Tashkent", joinedAt: "2024-10-01" },
  { name: "Bekzod Salimov", age: 21, city: "Tashkent", joinedAt: "2024-03-17" },
  { name: "Dilnoza Sattorova", age: 33, city: "Tashkent", joinedAt: "2024-01-08" },

  { name: "Shakhnoza Olimova", age: 26, city: "Ferghana", joinedAt: "2024-07-19" },
  { name: "Sunnat Kholmatov", age: 34, city: "Ferghana", joinedAt: "2024-06-05" },
  { name: "Gulnora Hamdamova", age: 23, city: "Ferghana", joinedAt: "2024-11-02" },
  { name: "Bahrom Sultonov", age: 30, city: "Ferghana", joinedAt: "2024-02-26" },

  { name: "Laziz Mamatkulov", age: 25, city: "Namangan", joinedAt: "2024-04-15" },
  { name: "Gulruh Ergasheva", age: 28, city: "Namangan", joinedAt: "2024-03-08" },
  { name: "Akmal Narziqulov", age: 32, city: "Namangan", joinedAt: "2024-09-28" },
  { name: "Malika Zufarova", age: 22, city: "Namangan", joinedAt: "2024-06-30" },

  { name: "Zafar Rasulov", age: 29, city: "Andijon", joinedAt: "2024-07-11" },
  { name: "Nodira Khaitova", age: 27, city: "Andijon", joinedAt: "2024-05-09" },
  { name: "Kamron Saidaliev", age: 24, city: "Andijon", joinedAt: "2024-08-18" },
  { name: "Madina Abdullaeva", age: 31, city: "Andijon", joinedAt: "2024-10-07" },

  { name: "Shukhrat Murodov", age: 36, city: "Sirdaryo", joinedAt: "2024-01-21" },
  { name: "Zebo Qo'chqorova", age: 25, city: "Sirdaryo", joinedAt: "2024-06-12" },
  { name: "Sirojiddin Tolibov", age: 20, city: "Sirdaryo", joinedAt: "2024-07-30" },

  { name: "Yulduz Sobirova", age: 28, city: "Jizzakh", joinedAt: "2024-04-27" },
  { name: "Miraziz Tohirov", age: 35, city: "Jizzakh", joinedAt: "2024-02-14" },
  { name: "Rano Po'latova", age: 23, city: "Jizzakh", joinedAt: "2024-09-05" },

  { name: "Rustam Khudoyberdiyev", age: 32, city: "Samarkand", joinedAt: "2024-05-02" },
  { name: "Nilufar Karimkhonova", age: 30, city: "Samarkand", joinedAt: "2024-03-19" },
  { name: "Saidjon Bahromov", age: 26, city: "Samarkand", joinedAt: "2024-07-03" },
  { name: "Aziza Tohirova", age: 22, city: "Samarkand", joinedAt: "2024-08-26" },
  { name: "Sherzod Aripov", age: 34, city: "Samarkand", joinedAt: "2024-10-15" },

  { name: "Gulbahor Zokirova", age: 29, city: "Kashkadarya", joinedAt: "2024-04-02" },
  { name: "Oybek Burkhanov", age: 33, city: "Kashkadarya", joinedAt: "2024-02-23" },
  { name: "Saodat Raimova", age: 24, city: "Kashkadarya", joinedAt: "2024-09-14" },
  { name: "Shahzod Mukhammedov", age: 31, city: "Kashkadarya", joinedAt: "2024-06-21" },

  { name: "Lola Qurbonova", age: 27, city: "Surkhandarya", joinedAt: "2024-05-28" },
  { name: "Elyor Khasanov", age: 35, city: "Surkhandarya", joinedAt: "2024-03-04" },
  { name: "Munira Turaeva", age: 21, city: "Surkhandarya", joinedAt: "2024-08-08" },
  { name: "Umidjon Gapparov", age: 29, city: "Surkhandarya", joinedAt: "2024-11-06" },

  { name: "Dilya Dospanova", age: 28, city: "Karakalpakstan", joinedAt: "2024-02-08" },
  { name: "Bakhodir Yusupov", age: 38, city: "Karakalpakstan", joinedAt: "2024-06-07" },
  { name: "Samira Nukusova", age: 24, city: "Karakalpakstan", joinedAt: "2024-07-22" },
  { name: "Azamat Qaldayev", age: 33, city: "Karakalpakstan", joinedAt: "2024-10-19" },

  { name: "Farida Usmanova", age: 26, city: "Navoi", joinedAt: "2024-02-02" },
  { name: "Ravshan Khaydarov", age: 34, city: "Navoi", joinedAt: "2024-04-18" },
  { name: "Malohat Umarova", age: 29, city: "Navoi", joinedAt: "2024-09-25" },

  { name: "Behruz Alimov", age: 30, city: "Khorezm", joinedAt: "2024-05-11" },
  { name: "Dildora Jalilova", age: 27, city: "Khorezm", joinedAt: "2024-07-17" },
  { name: "Suhrob Qodirov", age: 33, city: "Khorezm", joinedAt: "2024-08-29" },
  { name: "Rayhona Erkinova", age: 22, city: "Khorezm", joinedAt: "2024-03-31" },

  { name: "Jasur Mirzayev", age: 28, city: "Bukhoro", joinedAt: "2024-06-09" },
  { name: "Madina Tojiboyeva", age: 25, city: "Bukhoro", joinedAt: "2024-05-15" },
  { name: "Ismoil Rahmatullaev", age: 31, city: "Bukhoro", joinedAt: "2024-10-23" },
  { name: "Shirin Adkhamova", age: 23, city: "Bukhoro", joinedAt: "2024-01-29" },
];
