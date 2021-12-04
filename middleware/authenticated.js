export default function ({ $auth, redirect,localePath }) {
  if (!$auth.loggedIn) {
    return redirect(localePath('/sign-in'))
  }
}
