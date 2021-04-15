import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;

//  axios უნდა დავაიმპორტოთ ამ ფაილიდან  და axios.get() დაგვიბრუნებს ბაიზუერელს და დავუმეტებთ კონკრეტულ უერელს რექუესთ.ჯს-დან
