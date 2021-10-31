export default function ({ $auth, redirect, localePath, router }) {
  if ($auth.user) {
    if (!$auth.user.verified) {
      return redirect('/verify-email')
    }
  }
}
