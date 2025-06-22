export interface RegisterFormData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  dui: string;
  role: "ADMIN" | "USER";
}

export type LoginFormData = {
  username: string;
  password: string;
};

//EXPENSES :
export type CategoriesType = {
  id: string;
  name: string;
  icon: string;
};

export type ExpenseType = {
  id: string;
  expenseName: string;
  amount: number;
  category: string;
  date: string;
};
