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

  const forgot = document.getElementById("forgot-password");

  if (forgot) {
    forgot.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();

      if (!email) {
        message.textContent =
          "Enter your email address, then tap Forgot Password.";
        return;
      }

      forgot.style.pointerEvents = "none";
      message.textContent = "Requesting password recovery email...";

      const { error } = await client.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "https://sinist3rkr3w.com/deago/command/reset-password.html"
        }
      );

      forgot.style.pointerEvents = "";

      if (error) {
        message.textContent =
          "Unable to send recovery email. Please try again later.";
        return;
      }

      message.textContent =
        "If this account exists, a password recovery email has been requested. Check your inbox.";
    });
  }

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
