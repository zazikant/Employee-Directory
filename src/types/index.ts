export interface Employee {
  id: string;
  name: string;
  hobbies: string;
  tenure_years: number;
  tenure_months?: number;
  department: string;
  personal_traits?: string;
  photo_url?: string;
}
