export default function ({ $auth, redirect, localePath }) {
  const role = $auth.user.role.toLowerCase()

  if (role !== 'admin' && role !== 'moderator' && role !== 'super') {
    return redirect(localePath('/unauthorized'))
  }
}
