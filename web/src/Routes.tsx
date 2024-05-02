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
    </Router>
  )
}

export default Routes
