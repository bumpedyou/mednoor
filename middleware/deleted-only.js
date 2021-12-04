export default function ({ $auth, redirect, localePath }) {
  if ($auth.user && !$auth.user.deleted) {
    return redirect(localePath('/welcome'))
  }
}
