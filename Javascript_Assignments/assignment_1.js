//Q1. Write a program to demonstrate how a function can be passed as a parameter to another function.

function sayHello(){
    console.log("Hello");
  }
  
  function sayMyName(callback,name){
    callback();
    console.log(name);
  }
sayMyName(sayHello,"Arjun");



// Q2. An arrow function takes two arguments firstName and lastName and returns a 2 letter string that represents the first letter of both the arguments. For the arguments Roger and Waters, the function returns ‘RW’. Write this function.


const getInitials = (firstname , lastName)=>{
    if(firstname.length < 1 || lastName.length <1){
        return "Invalid Input";
    }
    return firstname[0].toUpperCase() + lastName[0].toUpperCase();
}
const initials = getInitials("arjun","singh");
console.log(initials);