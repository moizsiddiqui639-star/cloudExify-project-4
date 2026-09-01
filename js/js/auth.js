// Register User
async function registerUser(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  
  if (data.user) {
    const { error: pErr } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, full_name: fullName, role: 'customer' }]);
    if (pErr) throw pErr;
  }
  return data;
}

// Login User
async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Logout
async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

// Protect Admin Page
async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    window.location.href = 'index.html';
  }
}