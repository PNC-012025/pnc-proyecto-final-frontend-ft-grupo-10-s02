export type RegisterFormData = {
  username: string
  firstName: string
  lastName: string
  dui: string
  password: string
  email: string
}

export type LoginFormData = {
  username: string
  password: string
}


//EXPENSES : 
export type CategoriesType = {
    id: string,
    name: string,
    icon: string
}

export type ExpenseType = {
    id: string
    expenseName: string,
    amount: number,
    category: string,
    date: string,
}