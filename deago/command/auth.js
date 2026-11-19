"use strict";

const config = window.DEAGO_CONFIG;
const message = document.getElementById("message");
const form = document.getElementById("login");

if (!config || !window.supabase) {
  message.textContent = "Authentication configuration unavailable.";
} else {
  const client = window.supabase.createClient(
    config.supabaseUrl,
    config.supabaseKey
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Authenticating...";

    const { data, error } =
      await client.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      message.textContent = "Login unsuccessful. Check your credentials.";
      return;
    }

    const { data: leadership, error: roleError } =
      await client
        .from("deago_leadership")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

    if (roleError || !leadership ||
        !["founder", "administrator"].includes(leadership.role)) {
      await client.auth.signOut();
      message.textContent = "Leadership authorization required.";
      return;
    }

    message.textContent =
      "Authenticated as " + leadership.role +
      ". Opening Command Dashboard...";

    window.location.replace("./dashboard.html");
  });
}
