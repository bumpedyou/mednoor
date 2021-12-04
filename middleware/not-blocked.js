export default function ({ $auth, redirect, localePath }) {
  if ($auth.user && $auth.user.blocked) {
    return redirect(localePath('/blocked'))
  }
}
