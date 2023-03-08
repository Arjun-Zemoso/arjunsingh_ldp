/* Create a simple application which displays two counts:Local Score, Session Score and a button to increment these counts. Local score must persist in Local Storage and Session score must persist in Session Storage and must reset on closing the session.
*/

const num1 = document.querySelector(".number1");
const num2 = document.querySelector(".number2");
var count1 = localStorage.getItem("count1");
if (count1 == null) {
  count1 = 0;
  localStorage.setItem("count1", 0);
}
var count2 = sessionStorage.getItem("count2");
if (count2 == null) {
  count2 = 0;
  sessionStorage.setItem("count2", count2);
}
num1.textContent = count1;
num2.textContent = count2;
const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");

btn1.addEventListener("click", () => {
  count1++;
  num1.textContent = count1;
  localStorage.setItem("count1", count1);
});

btn2.addEventListener("click", () => {
  count2++;
  num2.textContent = count2;
  sessionStorage.setItem("count2", count2);
});
