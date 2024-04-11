// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/classes/{id:String}" page={ClassPage} name="manageClass" />
      <Route path="/classes" page={ClassesPage} name="classes" />
      <Route path="/profile" page={ProfilePage} name="profile" />
      <Route path="/sign-up" page={SignUpPage} name="signUp" />
      <Route path="/sign-in" page={SignInPage} name="signIn" />
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
      {/* <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Grades" titleTo="grades" buttonLabel="New Grade" buttonTo="newGrade">
        <Route path="/grades/new" page={GradeNewGradePage} name="newGrade" />
        <Route path="/grades/{id:Int}/edit" page={GradeEditGradePage} name="editGrade" />
        <Route path="/grades/{id:Int}" page={GradeGradePage} name="grade" />
        <Route path="/grades" page={GradeGradesPage} name="grades" />
      </Set>
      <Set wrap={ScaffoldLayout} title="SubjectStudentses" titleTo="subjectStudentses" buttonLabel="New SubjectStudents" buttonTo="newSubjectStudents">
        <Route path="/subject-studentses/new" page={SubjectStudentsNewSubjectStudentsPage} name="newSubjectStudents" />
        <Route path="/subject-studentses/{id:Int}/edit" page={SubjectStudentsEditSubjectStudentsPage} name="editSubjectStudents" />
        <Route path="/subject-studentses/{id:Int}" page={SubjectStudentsSubjectStudentsPage} name="subjectStudents" />
        <Route path="/subject-studentses" page={SubjectStudentsSubjectStudentsesPage} name="subjectStudentses" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Subjects" titleTo="subjects" buttonLabel="New Subject" buttonTo="newSubject">
        <Route path="/subjects/new" page={SubjectNewSubjectPage} name="newSubject" />
        <Route path="/subjects/{id:Int}/edit" page={SubjectEditSubjectPage} name="editSubject" />
        <Route path="/subjects/{id:Int}" page={SubjectSubjectPage} name="subject" />
        <Route path="/subjects" page={SubjectSubjectsPage} name="subjects" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set> */}
    </Router>
  )
}

export default Routes
