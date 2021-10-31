export default function ({ $auth, redirect, localePath, router }) {
  if ($auth.user) {
    console.log('Verified', $auth.user.verified)
    if ($auth.user.verified) {
      return redirect('/')
    }
  }
}
