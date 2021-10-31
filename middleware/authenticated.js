export default function ({ $auth, redirect, localePath, router }) {
  if (!$auth.loggedIn) {
    return redirect('/sign-in')
  }
}
