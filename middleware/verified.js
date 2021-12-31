export default function ({ $auth, redirect, localePath }) {
  if ($auth.user) {
    if (!$auth.user.verified) {
      return redirect(localePath('/verify-email'))
    }
    console.log('This is user is verified. But... Does he have a phone no?')
    console.log($auth.user)
  }
}
