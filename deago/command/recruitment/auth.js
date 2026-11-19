"use strict";

(async () => {
  const config = window.DEAGO_CONFIG;

  if (!config || !window.supabase) {
    window.location.replace("../index.html");
    return;
  }

  const client = window.supabase.createClient(
    config.supabaseUrl,
    config.supabaseKey
  );

  const { data: sessionData, error: sessionError } =
    await client.auth.getUser();

  if (sessionError || !sessionData.user) {
    window.location.replace("../index.html");
    return;
  }

  const { data: leadership, error: roleError } =
    await client
      .from("deago_leadership")
      .select("role")
      .eq("user_id", sessionData.user.id)
      .single();

  if (roleError || !leadership ||
      !["founder", "administrator"].includes(leadership.role)) {
    await client.auth.signOut();
    window.location.replace("../index.html");
    return;
  }

  document.getElementById("command-content").hidden = false;
  const logout = document.getElementById("logout");
  if (logout) logout.hidden = false;
  document.getElementById("access-status").textContent =
    "Authenticated: " + leadership.role;

  if (logout) logout.onclick = async () => {
    await client.auth.signOut();
    window.location.replace("../index.html");
  };
})();
