Ex-Employee Directory Web Application

**Project Title:** Ex-Employee Directory Web Application

**Project Overview:**
Build a searchable, filterable directory web application for browsing current and former employee profiles. The app will feature a modern, responsive UI with real-time search, advanced filtering, role-based admin access, and seamless Supabase integration.

**Tech Stack:**
- **Frontend:** Next.js (React)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL with Supabase MCP for operations)
- **Authentication:** Supabase Auth
- **Deployment:** Netlify

---

### Core Features
#### 1. **Employee Profile Management**
- **Required Fields:** Name (text), Hobbies (text), Tenure (Years and Months), Department (text).
- **Optional Fields:** Personal Traits (Long text).
- **Photo:** External photo URL (the application does not store image files).

#### 2. **Directory View**
- **Responsive Grid:** A responsive grid of profile cards that adjusts the number of columns based on screen size (from 1 on mobile to 5 on extra-large desktops).
- **Profile Cards:** Interactive cards that flip on hover to reveal more details. Displays photo, name, and department.

#### 3. **Search & Filtering**
- **Real-Time Search:** Debounced fuzzy search across employee names and departments.

#### 4. **Profile Pages**
- **Full Details:** Clean layout with sections for hobbies, tenure, department, and personal traits.
- **Shareable URLs:** Unique slug-based routes (e.g., `/employee/john-doe`).

#### 5. **Admin Panel**
- **Authentication:** Supabase Auth with protected routes for the admin panel.
- **CRUD Operations:**
  - **Add/Edit:** Manually add or edit employee profiles. The photo is managed via an external URL.
  - **Delete:** Delete profiles with a confirmation dialog.
- **Bulk Upload:**
  - **CSV Upload:** Admins can upload a CSV file to bulk add and update employee records.
  - **Upsert Logic:** The system uses an "upsert" operation based on a unique combination of `name` and `photo_url`. If a record with the same name and photo URL exists, it's updated; otherwise, a new record is created.

#### 6. **Database Schema (Supabase)**
- **`employees` Table:**
  ```sql
  CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    hobbies TEXT NOT NULL,
    tenure_years NUMERIC NOT NULL DEFAULT 0,
    tenure_months NUMERIC,
    department TEXT NOT NULL,
    personal_traits TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT employees_name_photo_url_key UNIQUE (name, photo_url)
  );
  ```
- **RLS Policies:**
  - **Employees Table:**
    - Public read access is enabled for the `employees` table.
    - Write, update, and delete access is restricted to authenticated admin users.

#### 7. **UI/UX Requirements**
- **Brand Colors:**
  - **Primary:** `#fecf07`
  - **Secondary:** `#183319`
  - **Background:** White
- **Responsive:** Mobile-first design.
- **Accessibility:** Semantic HTML, ARIA labels, and keyboard navigation.

---

### Project To-Do List
- [x] Set up the Next.js project with TypeScript and Tailwind CSS.
- [x] Set up Supabase project and initial database schema.
- [x] Configure Supabase client in the Next.js application.
- [x] Implement user authentication with Supabase Auth.
- [x] Create the main directory view with responsive profile cards.
- [x] Implement real-time fuzzy search.
- [x] Create detailed profile pages.
- [x] Build the admin panel for CRUD operations.
- [x] **Updated:** Refactor photo handling to use external URLs instead of Supabase Storage.
- [x] **Updated:** Refactor tenure to use `tenure_years` and `tenure_months`.
- [x] **New:** Implement CSV bulk upload with "upsert" functionality.
- [x] **New:** Add unique constraint to the `employees` table.
- [x] Deploy the application to Netlify.