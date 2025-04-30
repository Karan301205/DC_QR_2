export const students = [
  { name: "Karan", phone: "1234", email: "krn@zxc.com" },
  { name: "Varun", phone: "125432", email: "vrn@zxc.com" },
  { name: "Kanni", phone: "352132", email: "krn@zxc.com" },
  { name: "Gyan", phone: "94582", email: "gyn@zxc.com" }
];

// Initialize meal status for each student
export const initializeMealStatus = () => {
  const mealStatus = {};
  students.forEach(student => {
    mealStatus[student.email] = {
      breakfast: false,
      lunch: false,
      snacks: false,
      dinner: false
    };
  });
  return mealStatus;
}; 