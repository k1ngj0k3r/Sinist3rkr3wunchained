"use strict";

(async () => {
  const output = document.getElementById("applicants");
  const config = window.DEAGO_CONFIG;

  if (!output || !config || !window.supabase) return;

  const client = window.supabase.createClient(
    config.supabaseUrl,
    config.supabaseKey
  );

  const { data: userData, error: userError } =
    await client.auth.getUser();

  if (userError || !userData.user) return;

  const { data: leadership, error: roleError } = await client
    .from("deago_leadership")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (roleError || !leadership ||
      !["founder", "administrator"].includes(leadership.role)) return;

  const { data, error } = await client
    .from("deago_applicants")
    .select("id, preferred_name, callsign, preferred_division, assigned_division, status")
    .order("created_at", { ascending: false });

  output.replaceChildren();

  if (error) {
    output.textContent = "Unable to load applications: " + error.message;
    return;
  }

  if (!data.length) {
    output.textContent = "No applications received yet.";
    return;
  }

  for (const applicant of data) {
    const card = document.createElement("div");
    card.className = "card";

    const heading = document.createElement("h3");
    heading.textContent = applicant.preferred_name || "Unnamed applicant";

    const details = document.createElement("p");
    details.textContent =
      "Callsign: " + (applicant.callsign || "None") +
      " | Division: " + (applicant.preferred_division || "Unassigned") +
      " | Status: " + (applicant.status || "Pending");

    const controls = document.createElement("div");

    const approve = document.createElement("button");
    approve.textContent = "✅ Approve";

    const reject = document.createElement("button");
    reject.textContent = "❌ Reject";

    async function updateStatus(status) {
      const { error } = await client
        .from("deago_applicants")
        .update({ status })
        .eq("id", applicant.id);

      if (error) {
        alert("Update failed: " + error.message);
        return;
      }

      applicant.status = status;
      details.textContent =
        "Callsign: " + (applicant.callsign || "None") +
        " | Division: " + (applicant.preferred_division || "Unassigned") +
        " | Status: " + status;
    }

    approve.onclick = () => updateStatus("approved");
    reject.onclick = () => updateStatus("rejected");

    const divisionSelect = document.createElement("select");
    divisionSelect.setAttribute("aria-label", "Assigned division");

    const divisions = [
      "Unassigned",
      "Community Operations",
      "Investigations & Media",
      "Operations & Administration"
    ];

    for (const division of divisions) {
      const option = document.createElement("option");
      option.value = division === "Unassigned" ? "" : division;
      option.textContent = division;
      divisionSelect.append(option);
    }

    divisionSelect.value = applicant.assigned_division || "";

    const saveDivision = document.createElement("button");
    saveDivision.textContent = "Save Division";

    saveDivision.onclick = async () => {
      saveDivision.disabled = true;

      const { data, error } = await client
        .from("deago_applicants")
        .update({
          assigned_division: divisionSelect.value || null
        })
        .eq("id", applicant.id)
        .select("assigned_division")
        .maybeSingle();

      saveDivision.disabled = false;

      if (error || !data) {
        alert("Division update failed or was not permitted.");
        return;
      }

      applicant.assigned_division = data.assigned_division;
      alert("Division assignment saved.");
    };

    controls.append(approve, reject, divisionSelect, saveDivision);
    card.append(heading, details, controls);
    output.append(card);
  }
})();
